import { FileUpload } from '@/hooks/useMultipleUploads'
import { formatBytes, formatTimeRemaining } from '@/lib/utils'
import { AlertTriangle, X } from 'lucide-react'

interface UploadProgressItemProps {
  upload: FileUpload
  onCancel: (id: string) => void
}

export function UploadProgressItem({ upload, onCancel }: UploadProgressItemProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm truncate max-w-[70%]">{upload.file.name}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCancel(upload.id)
          }}
          className="p-1 hover:bg-red-600/10 rounded-full"
        >
          <X className="h-4 w-4 text-red-500" />
        </button>
      </div>

      <div className="w-full bg-[#384455] rounded-full h-2 overflow-hidden">
        {upload.progress && (
          <div
            className={`h-full transition-all duration-300 ${
              upload.status === 'completed' ? 'bg-green-500' : 'bg-[#7849de]'
            }`}
            style={{
              width:
                upload.status === 'completed'
                  ? '100%'
                  : `${(upload.progress.bytesUploaded / upload.progress.bytesTotal) * 100}%`,
            }}
          />
        )}
      </div>

      {upload.status === 'error' && (
        <div className="flex items-center mt-1 text-red-500 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {upload.error}
        </div>
      )}

      {upload.status === 'completed' ? (
        <div className="mt-2">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-500 text-sm">Upload complete</span>
          </div>
        </div>
      ) : (
        upload.progress && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#809fb8] block mb-1">Progress</span>
                <span className="text-white">
                  {formatBytes(upload.progress.bytesUploaded)} /{' '}
                  {formatBytes(upload.progress.bytesTotal)}
                </span>
              </div>
              <div>
                <span className="text-[#809fb8] block mb-1">Speed</span>
                <span className="text-white">{formatBytes(upload.progress.speed)}/s</span>
              </div>
              <div>
                <span className="text-[#809fb8] block mb-1">Time Remaining</span>
                <span className="text-white">{formatTimeRemaining(upload.progress.eta)}</span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
