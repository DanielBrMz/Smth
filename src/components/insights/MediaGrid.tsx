import { MediaPlayer } from '@/components/insights/MediaPlayer'
import { cn, formatBytes } from '@/lib/utils'
import { MediaItem } from '@/types'

interface MediaGridProps {
  mediaItems: MediaItem[]
  onSelect: (media: MediaItem) => void
  selectedMedia?: MediaItem | null
}

export function MediaGrid({ mediaItems, onSelect, selectedMedia }: MediaGridProps) {
  const getDisplayFilename = (filename: string): string => {
    const parts = filename.split('-')
    return parts[parts.length - 1]
  }

  return (
    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
      {mediaItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            'bg-[#232652] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#7849DE] transition-all duration-200 cursor-pointer',
            selectedMedia?.id === item.id && 'ring-2 ring-[#7849DE]',
          )}
          onClick={() => onSelect(item)}
        >
          <div className="relative aspect-video bg-black">
            <MediaPlayer src={item.streamingUrl} mimeType={item.mimeType} />
          </div>
          <div className="p-2">
            <h3 className="text-white font-medium truncate text-sm">
              {getDisplayFilename(item.filename)}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[#809fb8]">{formatBytes(item.filesize)}</span>
              <span className="text-xs text-[#809fb8]">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
