import { useState, useRef, useCallback } from 'react'
import { tusClient } from '@/lib/tus'

interface UploadProgress {
  bytesUploaded: number
  bytesTotal: number
  speed: number
  eta: number
}

interface UseMediaUploadProps {
  onUploadComplete: (fileMeta: {
    id: string
    url: string
    streamingUrl: string
    mimeType: string
  }) => void
  onProgress?: (progress: number) => void
}

export function useMediaUpload({ onUploadComplete, onProgress }: UseMediaUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const uploadRef = useRef<ReturnType<typeof tusClient.upload> | null>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)
      const startTime = Date.now()

      try {
        const upload = tusClient.upload(file, {
          endpoint: '/api/upload',
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          chunkSize: 10 * 1024 * 1024, // 10MB chunks
          onProgress: (bytesUploaded, bytesTotal) => {
            const elapsed = (Date.now() - startTime) / 1000
            const speed = bytesUploaded / elapsed
            const eta = (bytesTotal - bytesUploaded) / speed
            const progressPercent = (bytesUploaded / bytesTotal) * 100

            setUploadProgress({
              bytesUploaded,
              bytesTotal,
              speed,
              eta,
            })

            if (onProgress) {
              onProgress(progressPercent)
            }
          },
          onSuccess: async () => {
            try {
              const userResponse = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/endorsers/me`,
                {
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
              const userData = await userResponse.json()

              const key = upload.url?.split('/').pop()
              if (!key) throw new Error('Invalid upload URL')

              const cleanKey = key
              console.log('Clean key being used:', cleanKey)

              const payload = {
                filename: cleanKey,
                mimeType: file.type,
                filesize: file.size,
                url: `/api/contents/proxy-stream/${encodeURIComponent(cleanKey)}`,
                streamingUrl: `/api/contents/proxy-stream/${encodeURIComponent(cleanKey)}`,
                createdBy: userData!.user.id,
              }

              console.log('Creating content with payload:', payload)

              const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contents`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              })

              if (!response.ok) {
                const errorText = await response.text()
                console.error('Content creation failed:', response.status, errorText)
                throw new Error(`Failed to create content: ${errorText}`)
              }

              const { doc: mediaDoc } = await response.json()
              console.log('Content created successfully:', mediaDoc)

              setIsUploading(false)

              // Call onUploadComplete with the media document info
              onUploadComplete({
                id: mediaDoc.id,
                url: mediaDoc.url,
                streamingUrl: mediaDoc.streamingUrl || mediaDoc.url,
                mimeType: file.type,
              })
            } catch (err) {
              console.error('Upload registration error:', err)
              setError(err instanceof Error ? err.message : 'Failed to register upload')
              setIsUploading(false)
            }
          },
          onError: (error) => {
            console.error('Upload error:', error)
            setError(error.message || 'Upload failed')
            setIsUploading(false)
          },
        })

        uploadRef.current = upload
        await upload.start()
      } catch (err) {
        console.error('Upload error:', err)
        setError(err instanceof Error ? err.message : 'Upload failed')
        setIsUploading(false)
      }
    },
    [onUploadComplete, onProgress],
  )

  const cancelUpload = useCallback(() => {
    if (uploadRef.current) {
      uploadRef.current.abort()
      uploadRef.current = null
    }
    setUploadProgress(null)
    setIsUploading(false)
    setError(null)
  }, [])

  return {
    uploadProgress,
    error,
    isUploading,
    handleUpload,
    cancelUpload,
  }
}
