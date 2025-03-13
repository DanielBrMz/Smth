import { useState, useEffect } from 'react'
import { ContentType, Insight, MediaSource, PendingMediaUpdate, MediaItem } from '@/types'
import { contentTypeTestData, key_to_val } from '@/constants/positions'

const getLabelFromValue = (value: string): string | undefined => {
  const valToKeyMap = key_to_val.reduce<Record<string, string>>((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {})
  return valToKeyMap[value]
}

const contentLabelToValueMap = contentTypeTestData.reduce<Record<string, string>>((acc, item) => {
  acc[item.label] = item.value
  return acc
}, {})

export function useInsight(id: string) {
  const [insight, setInsight] = useState<Insight | null>(null)
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null)
  const [temporaryContentId, setTemporaryContentId] = useState<string | null>(null)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [pendingMediaUpdate, setPendingMediaUpdate] = useState<PendingMediaUpdate | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  useEffect(() => {
    const fetchInsight = async (): Promise<void> => {
      if (id === 'new') {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/insights/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch insight')
        }

        const data: Insight = await response.json()
        setInsight(data)

        const labelv = getLabelFromValue(data.insight_location)
        const insight_image = contentLabelToValueMap[labelv || '']

        if (labelv) {
          setContentType({ label: labelv, value: insight_image || '' })
        }

        if (data.contents) {
          setMediaSource({
            url: data.contents.streamingUrl || data.contents.url,
            mimeType: data.contents.mimeType,
          })
          setTemporaryContentId(data.contents.id)
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setIsLoading(false)
      }
    }

    fetchInsight()
  }, [id])

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media)
    // Don't update pendingMediaUpdate here to prevent premature creation
  }

  const handleUploadComplete = (fileMeta: MediaItem): void => {
    // Only update pendingMediaUpdate when explicitly completing the upload
    setPendingMediaUpdate({
      id: String(fileMeta.id),
      url: fileMeta.streamingUrl || fileMeta.url,
      mimeType: fileMeta.mimeType,
    })

    // Update media source for display
    setMediaSource({
      url: fileMeta.streamingUrl || fileMeta.url,
      mimeType: fileMeta.mimeType,
    })
  }

  const removeMedia = (): void => {
    setTemporaryContentId(null)
    setMediaSource(null)
    setPendingMediaUpdate(null)
    setSelectedMedia(null)
  }

  const confirmMediaSelection = () => {
    if (selectedMedia) {
      handleUploadComplete(selectedMedia)
      setIsMediaModalOpen(false)
    }
  }

  return {
    insight,
    contentType,
    setContentType,
    mediaSource,
    isLoading,
    error,
    isMediaModalOpen,
    showConfirmation,
    pendingMediaUpdate,
    temporaryContentId,
    selectedMedia,
    handleMediaSelect,
    handleUploadComplete,
    confirmMediaSelection,
    removeMedia,
    setIsMediaModalOpen,
    setShowConfirmation,
    setMediaSource,
    setTemporaryContentId,
  }
}
