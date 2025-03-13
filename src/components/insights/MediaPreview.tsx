import { MediaPlayer } from '@/components/insights/MediaPlayer'
import { formatBytes } from '@/lib/utils'

interface MediaPreviewProps {
  url: string
  mimeType: string
  fileSize?: number
  onRemove?: () => void
  onChangeFile?: () => void
}

export function MediaPreview({
  url,
  mimeType,
  fileSize,
  onRemove,
  onChangeFile,
}: MediaPreviewProps) {
  return (
    <div className="mt-4 space-y-2">
      <MediaPlayer src={url} mimeType={mimeType} />
      {fileSize && <p className="text-sm text-[#809fb8]">File size: {formatBytes(fileSize)}</p>}
      <div className="flex space-x-4">
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Remove Media
          </button>
        )}
        {onChangeFile && (
          <button
            type="button"
            onClick={onChangeFile}
            className="text-sm text-[#7849DE] hover:text-[#5a37a6] transition-colors"
          >
            Change File
          </button>
        )}
      </div>
    </div>
  )
}
