import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
  webpack: (config, { isServer }) => {
    // Handle external packages
    if (isServer) {
      config.externals = [...(config.externals || []), 'tus-js-client']
    }

    // Add support for .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })

    return config
  },
  env: {
    PAYLOAD_PUBLIC_SERVER_URL: NEXT_PUBLIC_SERVER_URL,
  },
  // Security and CORS headers
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS,HEAD' },
          {
            key: 'Access-Control-Allow-Headers',
            value: [
              'X-CSRF-Token',
              'X-Requested-With',
              'Accept',
              'Accept-Version',
              'Content-Length',
              'Content-MD5',
              'Content-Type',
              'Date',
              'X-Api-Version',
              'Tus-Resumable',
              'Upload-Length',
              'Upload-Metadata',
              'Upload-Offset',
              'Authorization',
            ].join(','),
          },
          {
            key: 'Access-Control-Expose-Headers',
            value: [
              'Upload-Offset',
              'Location',
              'Upload-Length',
              'Tus-Version',
              'Tus-Resumable',
              'Tus-Max-Size',
              'Tus-Extension',
              'Upload-Metadata',
            ].join(','),
          },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  // Rewrite rules if needed
  async rewrites() {
    return {
      beforeFiles: [],
    }
  },
}

export default withPayload(nextConfig)
