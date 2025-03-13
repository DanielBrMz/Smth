import { useState, useRef, useCallback } from 'react'
import { tusClient } from '@/lib/tus'

interface UploadProgress {
  bytesUploaded: number
  bytesTotal: number
  speed: number
  eta: number
}

export interface FileUpload {
  id: string
  file: File
  progress: UploadProgress | null
  error: string | null
  status: 'pending' | 'uploading' | 'completed' | 'error'
}

interface UseMultipleUploadsProps {
  onUploadComplete: (fileMeta: {
    id: string
    url: string
    streamingUrl: string
    mimeType: string
  }) => void
  onUploadStart?: (totalFiles: number) => void
  onProgress?: (progress: number) => void
}

export function useMultipleUploads({
  onUploadComplete,
  onUploadStart,
  onProgress,
}: UseMultipleUploadsProps) {
  const [uploads, setUploads] = useState<Map<string, FileUpload>>(new Map())
  const [isUploading, setIsUploading] = useState(false)
  const uploadRefs = useRef<Map<string, ReturnType<typeof tusClient.upload>>>(new Map())

  const uploadFile = async (fileUpload: FileUpload) => {
    const { file, id } = fileUpload
    const startTime = Date.now()

    try {
      const upload = tusClient.upload(file, {
        endpoint: '/api/upload',
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        chunkSize: 10 * 1024 * 1024,
        onProgress: (bytesUploaded, bytesTotal) => {
          const elapsed = (Date.now() - startTime) / 1000
          const speed = bytesUploaded / elapsed
          const eta = (bytesTotal - bytesUploaded) / speed

          setUploads((prev) => {
            const newUploads = new Map(prev)
            const upload = newUploads.get(id)
            if (upload) {
              upload.progress = { bytesUploaded, bytesTotal, speed, eta }
              upload.status = 'uploading'
            }
            return newUploads
          })

          if (onProgress) {
            const totalProgress = Array.from(uploads.values()).reduce((sum, upload) => {
              if (upload.progress) {
                return sum + (upload.progress.bytesUploaded / upload.progress.bytesTotal) * 100
              }
              return sum
            }, 0)
            onProgress(totalProgress / uploads.size)
          }
        },
        onSuccess: async () => {
          try {
            const userResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/endorsers/me`,
              {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
              },
            )
            const userData = await userResponse.json()

            const key = upload.url?.split('/').pop()
            if (!key) throw new Error('Invalid upload URL')

            const payload = {
              filename: key,
              mimeType: file.type,
              filesize: file.size,
              url: `/api/contents/proxy-stream/${encodeURIComponent(key)}`,
              streamingUrl: `/api/contents/proxy-stream/${encodeURIComponent(key)}`,
              key: key,
              createdBy: userData!.user.id,
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contents`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })

            if (!response.ok) throw new Error('Failed to create content')

            const { doc: mediaDoc } = await response.json()

            setUploads((prev) => {
              const newUploads = new Map(prev)
              const upload = newUploads.get(id)
              if (upload) {
                upload.status = 'completed'
                upload.progress = {
                  ...upload.progress!,
                  bytesUploaded: upload.progress!.bytesTotal,
                }
              }

              const allComplete = Array.from(newUploads.values()).every(
                (u) => u.status === 'completed' || u.status === 'error',
              )

              if (allComplete) {
                setTimeout(() => setIsUploading(false), 1000)
              }

              return newUploads
            })

            onUploadComplete({
              id: mediaDoc.id,
              url: mediaDoc.url,
              streamingUrl: mediaDoc.streamingUrl || mediaDoc.url,
              mimeType: file.type,
            })
          } catch (err) {
            handleUploadError(id, err as Error | string)
          }
        },
        onError: (error) => handleUploadError(id, error),
      })

      uploadRefs.current.set(id, upload)
      await upload.start()
    } catch (err) {
      handleUploadError(id, err as Error | string)
    }
  }

  const handleUploadError = (id: string, error: Error | string) => {
    setUploads((prev) => {
      const newUploads = new Map(prev)
      const upload = newUploads.get(id)
      if (upload) {
        upload.status = 'error'
        upload.error = error instanceof Error ? error.message : 'Upload failed'
      }
      return newUploads
    })
  }

  const startUploads = useCallback(
    async (acceptedFiles: File[]) => {
      const filesToUpload = acceptedFiles.slice(0, 5)
      if (filesToUpload.length === 0) return

      setIsUploading(true)
      if (onUploadStart) {
        onUploadStart(filesToUpload.length)
      }

      const newUploads = new Map<string, FileUpload>()
      filesToUpload.forEach((file) => {
        const id = crypto.randomUUID()
        newUploads.set(id, {
          id,
          file,
          progress: null,
          error: null,
          status: 'pending',
        })
      })

      setUploads(newUploads)

      for (const upload of newUploads.values()) {
        uploadFile(upload)
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUploadStart],
  )

  const cancelUpload = useCallback((id: string) => {
    const upload = uploadRefs.current.get(id)
    if (upload) {
      upload.abort()
      uploadRefs.current.delete(id)
    }
    setUploads((prev) => {
      const newUploads = new Map(prev)
      newUploads.delete(id)
      if (newUploads.size === 0) {
        setIsUploading(false)
      }
      return newUploads
    })
  }, [])

  return {
    uploads,
    isUploading,
    startUploads,
    cancelUpload,
  }
}
