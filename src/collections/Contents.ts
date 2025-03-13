import { CollectionConfig } from 'payload'
import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

export const Contents: CollectionConfig = {
  slug: 'contents',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdBy'],
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Make sure we're using the exact key for streamingUrl
        if (data.key) {
          return {
            ...data,
            streamingUrl: `/api/contents/proxy-stream/${encodeURIComponent(data.key)}`,
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'mimeType',
      type: 'text',
      required: true,
    },
    {
      name: 'filesize',
      type: 'number',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'streamingUrl',
      type: 'text',
      required: false,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'endorsers',
      admin: {
        readOnly: false,
        hidden: false,
      },
    },
  ],
  endpoints: [
    {
      path: '/proxy-stream/:key',
      method: 'get',
      handler: async (req) => {
        try {
          const { key } = req.routeParams as { key: string }
          const decodedKey = decodeURIComponent(key)

          console.log('Streaming request received:', {
            rawKey: key,
            decodedKey,
            bucket: process.env.R2_BUCKET,
          })

          // Try to find the content in our collection first
          const content = await req.payload.find({
            collection: 'contents',
            where: {
              key: {
                equals: decodedKey,
              },
            },
          })

          if (!content.docs.length) {
            console.log('Content not found in collection:', decodedKey)
            return Response.json({ error: 'Content not found' }, { status: 404 })
          }

          const headCommand = new HeadObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: decodedKey,
          })

          let headResult
          try {
            headResult = await s3Client.send(headCommand)
            console.log('File metadata retrieved:', {
              key: decodedKey,
              contentLength: headResult.ContentLength,
              contentType: headResult.ContentType,
            })
          } catch (error) {
            console.error('Failed to get file metadata:', {
              error,
              key: decodedKey,
              bucket: process.env.R2_BUCKET,
              fullError: JSON.stringify(error, null, 2),
            })
            return Response.json({ error: 'File not found in storage' }, { status: 404 })
          }

          const range = req.headers.get('range')
          const fileSize = headResult.ContentLength || 0
          const mimeType = headResult.ContentType || 'application/octet-stream'

          if (range) {
            const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
            const start = parseInt(startStr, 10)
            const end = endStr ? parseInt(endStr, 10) : fileSize - 1
            const contentLength = end - start + 1

            console.log('Range request:', { start, end, contentLength })

            const rangeCommand = new GetObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: decodedKey,
              Range: `bytes=${start}-${end}`,
            })

            const response = await s3Client.send(rangeCommand)

            if (!response.Body) {
              throw new Error('No response body from R2')
            }

            return new Response(response.Body as ReadableStream, {
              status: 206,
              headers: {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength.toString(),
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            })
          }

          const getCommand = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: decodedKey,
          })

          const response = await s3Client.send(getCommand)

          if (!response.Body) {
            throw new Error('No response body from R2')
          }

          return new Response(response.Body as ReadableStream, {
            headers: {
              'Content-Length': fileSize.toString(),
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Accept-Ranges': 'bytes',
            },
          })
        } catch (error) {
          console.error('Streaming error:', {
            error,
            stack: error instanceof Error ? error.stack : undefined,
            details: error instanceof Error ? error.message : 'Unknown error',
          })
          return Response.json(
            {
              error: 'Streaming failed',
              details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/delete-object/:key',
      method: 'delete',
      handler: async (req) => {
        try {
          const { key } = req.routeParams as { key: string }
          const decodedKey = decodeURIComponent(key)

          console.log('Deleting object from R2:', {
            bucket: process.env.R2_BUCKET,
            key: decodedKey,
          })

          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: decodedKey,
          })

          await s3Client.send(deleteCommand)

          return Response.json({ success: true })
        } catch (error) {
          console.error('Error deleting from R2:', error)
          return Response.json(
            {
              error: 'Failed to delete from R2',
              details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
          )
        }
      },
    },
    {
      path: '/me',
      method: 'get',
      handler: async (req) => {
        try {
          const { user } = req
          if (!user) return Response.json([], { status: 401 })

          const contents = await req.payload.find({
            collection: 'contents',
            where: { 'createdBy.id': { equals: user.id } },
            depth: 2,
          })

          return Response.json(contents)
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
}
