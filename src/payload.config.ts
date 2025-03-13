// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Endorsers } from './collections/Endorsers'
import { Contents } from './collections/Contents'
import { APIKeys } from './collections/APIKeys'
import { Insights } from './collections/Insights'
import { Audiences } from './collections/Audiences'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle = ({ doc }: { doc: { title?: string } }) => {
  return doc?.title ? `${doc.title} | Sidepocket Endorser Platform` : 'Sidepocket Endorser Platform'
}

const generateURL: GenerateURL = ({ doc }: { doc: { slug?: string } }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL!}/${doc.slug}`
    : process.env.NEXT_PUBLIC_SERVER_URL!
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: 'Sidepocket Endorser Platform',
      description: 'Sidepocket Content Management System',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/SP_icon.png',
        },
      ],
    },
    components: {
      beforeLogin: ['@/components/admin/BeforeLogin'],
      beforeDashboard: ['@/components/admin/DashboardOnboard'],
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    avatar: {
      Component: {
        path: '@/components/admin/ProfileAvatar',
      },
    },
  },
  collections: [Users, Endorsers, Insights, Audiences, Media, Contents, APIKeys],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_USER
        ? `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOSTNAME}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
        : process.env.DATABASE_URI!,
    },
  }),
  email: nodemailerAdapter({
    defaultFromName: 'Sidepocket Endorser Platform',
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY!,
    }),
  }),
  cors: [
    'https://www.sidepocket.app',
    'https://webapp-gamma-lac.vercel.app',
    process.env.NEXT_PUBLIC_SERVER_URL!,
  ],
  csrf: [
    'https://www.sidepocket.app',
    'https://webapp-gamma-lac.vercel.app',
    process.env.NEXT_PUBLIC_SERVER_URL!,
  ],
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        forcePathStyle: true,
      },
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    // storage-adapter-placeholder
  ],
})
