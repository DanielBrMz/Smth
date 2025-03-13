import { formatBytes, formatTimeRemaining } from '@/lib/utils'
import { UploadProgress } from '@/types'

interface UploadProgressBarProps {
  progress: UploadProgress
}

export function UploadProgressBar({ progress }: UploadProgressBarProps) {
  return (
    <div className="w-full space-y-4 px-6">
      <div className="w-full bg-[#384455] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#7849de] transition-all duration-300"
          style={{
            width: `${(progress.bytesUploaded / progress.bytesTotal) * 100}%`,
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-[#809fb8]">Progress</p>
          <p className="text-white">
            {formatBytes(progress.bytesUploaded)} / {formatBytes(progress.bytesTotal)}
          </p>
        </div>
        <div>
          <p className="text-[#809fb8]">Speed</p>
          <p className="text-white">{formatBytes(progress.speed)}/s</p>
        </div>
        <div>
          <p className="text-[#809fb8]">Time Remaining</p>
          <p className="text-white">{formatTimeRemaining(progress.eta)}</p>
        </div>
      </div>
    </div>
  )
}
