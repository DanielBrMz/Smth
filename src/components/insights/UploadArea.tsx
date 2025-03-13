import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { DropZone } from './DropZone'
import { MediaGrid } from './MediaGrid'
import { MediaPreview } from './MediaPreview'
import { MediaItem } from '@/types'

interface UploadAreaProps {
  onUploadComplete: (fileMeta: MediaItem) => void
  mimeTypes?: string[]
  onProgress?: (progress: number) => void
  className?: string
  currentMedia?: { url: string; mimeType: string } | null
  onRemoveMedia?: () => void
  isModalOpen?: boolean
  onModalOpenChange?: (open: boolean) => void
  fileSize?: number
}

export default function UploadArea({
  onUploadComplete,
  mimeTypes,
  onProgress,
  className,
  currentMedia,
  onRemoveMedia,
  isModalOpen,
  onModalOpenChange,
  fileSize,
}: UploadAreaProps) {
  const [showUploadArea, setShowUploadArea] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const { uploadProgress, error, isUploading, handleUpload, cancelUpload } = useMediaUpload({
    onUploadComplete: (media) => {
      setShowUploadArea(false)
      fetchMediaItems()
      setSelectedMedia(media as MediaItem)
    },
    onProgress,
  })

  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/contents/me')
      if (!response.ok) throw new Error('Failed to fetch media items')
      const data = await response.json()
      setMediaItems(data.docs)
    } catch (error) {
      console.error('Error fetching media:', error)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    await handleUpload(file)
  }

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media)
  }

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      onUploadComplete(selectedMedia)
      onModalOpenChange?.(false)
      setSelectedMedia(null)
      setShowUploadArea(false)
    }
  }

  const handleModalClose = () => {
    onModalOpenChange?.(false)
    setSelectedMedia(null)
    setShowUploadArea(false)
  }

  // Render preview when there's current media
  if (currentMedia) {
    return (
      <>
        <MediaPreview
          url={currentMedia.url}
          mimeType={currentMedia.mimeType}
          fileSize={fileSize}
          onRemove={onRemoveMedia}
          onChangeFile={() => onModalOpenChange?.(true)}
        />

        <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
          <DialogContent className="max-w-2xl bg-[#11142f] border-[#384455] p-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white mb-4">Select Media</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              {showUploadArea ? (
                <div className="border-b border-[#384455] pb-4">
                  <DropZone
                    onDrop={onDrop}
                    mimeTypes={mimeTypes}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    error={error}
                    onCancelUpload={cancelUpload}
                    className={className}
                  />
                </div>
              ) : (
                <Button
                  onClick={() => setShowUploadArea(true)}
                  className="bg-[#7849DE] hover:bg-[#5a37a6] text-white text-sm py-2"
                >
                  Upload New
                </Button>
              )}

              <MediaGrid
                mediaItems={mediaItems}
                onSelect={handleMediaSelect}
                selectedMedia={selectedMedia}
              />

              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-[#384455]">
                <Button variant="outline" onClick={handleModalClose} className="text-white">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSelection}
                  disabled={!selectedMedia}
                  className="bg-[#7849DE] hover:bg-[#5a37a6] text-white"
                >
                  Select Media
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Default view - upload button that opens modal
  return (
    <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
      <DialogTrigger asChild>
        <div className="w-full">
          <Button
            variant="outline"
            className={cn(
              'w-full h-24 border-2 border-dashed border-[#384455] rounded-xl bg-[#232652] hover:bg-[#2c2f5e]',
              className,
            )}
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-[#809fb8] mb-1" />
              <p className="text-[#809fb8] text-sm">Select or Upload Media</p>
            </div>
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-[#11142f] border-[#384455] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white mb-4">Select Media</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {showUploadArea ? (
            <div className="border-b border-[#384455] pb-4">
              <DropZone
                onDrop={onDrop}
                mimeTypes={mimeTypes}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={error}
                onCancelUpload={cancelUpload}
                className={className}
              />
            </div>
          ) : (
            <Button
              onClick={() => setShowUploadArea(true)}
              className="bg-[#7849DE] hover:bg-[#5a37a6] text-white text-sm py-2"
            >
              Upload New
            </Button>
          )}

          <MediaGrid
            mediaItems={mediaItems}
            onSelect={handleMediaSelect}
            selectedMedia={selectedMedia}
          />

          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-[#384455]">
            <Button variant="outline" onClick={handleModalClose} className="text-white">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedMedia}
              className="bg-[#7849DE] hover:bg-[#5a37a6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
