import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useMultipleUploads } from '@/hooks/useMultipleUploads'
import { UploadProgressItem } from './UploadProgressItem'
import { Upload } from 'lucide-react'

interface MultiUploadAreaProps {
  onUploadComplete: (fileMeta: {
    id: string
    url: string
    streamingUrl: string
    mimeType: string
  }) => void
  onUploadStart?: (totalFiles: number) => void
  mimeTypes?: string[]
  onProgress?: (progress: number) => void
  className?: string
}

export default function MultiUploadArea({
  onUploadComplete,
  onUploadStart,
  mimeTypes,
  onProgress,
  className,
}: MultiUploadAreaProps) {
  const { uploads, isUploading, startUploads, cancelUpload } = useMultipleUploads({
    onUploadComplete,
    onUploadStart,
    onProgress,
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUploads,
    accept: mimeTypes ? Object.fromEntries(mimeTypes.map((type) => [type, []])) : undefined,
    multiple: true,
    maxSize: 5 * 1024 * 1024 * 1024,
    maxFiles: 5,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        `relative flex flex-col items-center justify-center w-full border-2 border-dashed 
        rounded-xl bg-[#232652] hover:bg-[#2c2f5e] transition-all duration-200
        ${isDragActive ? 'border-[#7849de] bg-[#2c2f5e]' : 'border-[#384455]'}
        ${isUploading ? 'h-auto min-h-[12rem]' : 'h-32'}`,
        className,
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="w-full space-y-4 p-6">
          {Array.from(uploads.entries()).map(([id, upload]) => (
            <UploadProgressItem key={id} upload={upload} onCancel={cancelUpload} />
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <Upload className="mx-auto h-12 w-12 text-[#809fb8] mb-2" />
          <p className="text-[#809fb8] text-sm">
            {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-[#809fb8] mt-1">
            Max size: 5GB • Up to 5 files • {mimeTypes?.join(', ') || 'All formats'}
          </p>
        </div>
      )}
    </div>
  )
}
