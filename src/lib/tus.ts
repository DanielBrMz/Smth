import * as tus from 'tus-js-client' // Use namespace import

export const tusClient = {
  upload: (file: File, options: Partial<tus.UploadOptions> = {}) => {
    return new tus.Upload(file, {
      endpoint: '/api/upload',
      retryDelays: [0, 1000, 3000, 5000],
      removeFingerprintOnSuccess: true,
      chunkSize: 50 * 1024 * 1024, // 50MB chunks
      metadata: {
        filename: encodeURIComponent(file.name),
        filetype: file.type,
      },
      ...options,
    })
  },
}
