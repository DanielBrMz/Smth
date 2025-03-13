import { NextRequest } from 'next/server'
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

// Enhanced upload store to track parts
const uploadStore = new Map<
  string,
  {
    uploadId: string
    size: number
    offset: number
    parts: { PartNumber: number; ETag: string }[]
  }
>()

function parseTusMetadata(metadataHeader: string | null): Record<string, string> {
  if (!metadataHeader) return {}
  return Object.fromEntries(
    metadataHeader.split(',').map((item) => {
      const [key, value] = item.split(' ')
      return [key, Buffer.from(value, 'base64').toString()]
    }),
  )
}

export async function HEAD(request: NextRequest) {
  try {
    const key = decodeURIComponent(request.nextUrl.pathname.split('/upload/')[1])
    if (!key) {
      return new Response(null, { status: 404 })
    }

    console.log('HEAD request for key:', key)
    console.log('Upload store contents:', [...uploadStore.keys()])

    const uploadInfo = uploadStore.get(key)
    if (!uploadInfo) {
      return new Response(null, { status: 404 })
    }

    const headers = new Headers({
      'Tus-Resumable': '1.0.0',
      'Upload-Length': uploadInfo.size.toString(),
      'Upload-Offset': uploadInfo.offset.toString(),
      'Cache-Control': 'no-store',
    })

    return new Response(null, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('HEAD error:', error)
    return new Response(null, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const uploadLength = request.headers.get('upload-length')
    const metadata = parseTusMetadata(request.headers.get('upload-metadata'))

    if (!uploadLength || !metadata.filename) {
      return new Response(null, {
        status: 400,
        statusText: 'Missing required headers',
      })
    }

    // Replace spaces with underscores in filename
    const fileKey = `${uuidv4()}-${metadata.filename.replace(/\s+/g, '_')}`
    console.log('Creating new upload with key:', fileKey)

    const uploadCommand = new CreateMultipartUploadCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileKey,
      ContentType: metadata.filetype || 'application/octet-stream',
    })

    const multipartUpload = await s3Client.send(uploadCommand)

    // Initialize upload info with parts array
    uploadStore.set(fileKey, {
      uploadId: multipartUpload.UploadId!,
      size: parseInt(uploadLength),
      offset: 0,
      parts: [],
    })

    const headers = new Headers({
      Location: `/api/upload/${fileKey}`,
      'Tus-Resumable': '1.0.0',
      'Upload-Length': uploadLength,
      'Upload-Offset': '0',
      'Access-Control-Expose-Headers':
        'Location, Upload-Offset, Tus-Version, Tus-Resumable, Tus-Max-Size, Tus-Extension, Upload-Metadata',
    })

    return new Response(null, {
      status: 201,
      headers,
    })
  } catch (error) {
    console.error('POST error:', error)
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const key = decodeURIComponent(request.nextUrl.pathname.split('/upload/')[1])
    console.log('PATCH - File key being used:', key)
    if (!key) {
      return new Response(null, { status: 404 })
    }

    console.log('PATCH request for key:', key)
    console.log('Upload store contents:', [...uploadStore.keys()])

    const uploadInfo = uploadStore.get(key)
    if (!uploadInfo) {
      console.log('Upload info not found for key:', key)
      return new Response(null, { status: 404 })
    }

    const offset = parseInt(request.headers.get('upload-offset') || '0')
    const contentLength = parseInt(request.headers.get('content-length') || '0')

    if (isNaN(offset) || isNaN(contentLength)) {
      return new Response(null, { status: 400 })
    }

    console.log('Processing chunk:', {
      offset,
      contentLength,
      totalSize: uploadInfo.size,
      progress: `${(((offset + contentLength) / uploadInfo.size) * 100).toFixed(2)}%`,
    })

    const chunk = await request.arrayBuffer()
    const partNumber = Math.floor(offset / (10 * 1024 * 1024)) + 1

    const uploadCommand = new UploadPartCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      UploadId: uploadInfo.uploadId,
      PartNumber: partNumber,
      Body: Buffer.from(chunk),
      ContentLength: contentLength,
    })

    const uploadResult = await s3Client.send(uploadCommand)

    // Store part information
    uploadInfo.parts.push({
      PartNumber: partNumber,
      ETag: uploadResult.ETag!,
    })

    // Update offset
    uploadInfo.offset = offset + contentLength
    uploadStore.set(key, uploadInfo)

    // If this was the last chunk, complete the multipart upload
    if (uploadInfo.offset === uploadInfo.size) {
      console.log('Completing multipart upload for key:', key)
      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        UploadId: uploadInfo.uploadId,
        MultipartUpload: {
          Parts: uploadInfo.parts.sort((a, b) => a.PartNumber - b.PartNumber),
        },
      })

      await s3Client.send(completeCommand)
      console.log('Multipart upload completed successfully')
    }

    const headers = new Headers({
      'Tus-Resumable': '1.0.0',
      'Upload-Offset': uploadInfo.offset.toString(),
    })

    return new Response(null, {
      status: 204,
      headers,
    })
  } catch (error) {
    console.error('PATCH error:', error)
    return new Response(null, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Tus-Resumable': '1.0.0',
      'Tus-Version': '1.0.0',
      'Tus-Extension': 'creation,creation-with-upload',
      'Tus-Max-Size': '5368709120', // 5GB
      'Access-Control-Allow-Headers':
        'Tus-Resumable, Upload-Length, Upload-Metadata, Upload-Offset, Content-Type',
      'Access-Control-Allow-Methods': 'POST, HEAD, PATCH, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers':
        'Upload-Offset, Location, Upload-Length, Tus-Version, Tus-Resumable, Tus-Max-Size, Tus-Extension, Upload-Metadata',
    },
  })
}
