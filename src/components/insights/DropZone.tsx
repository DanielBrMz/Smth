import { Upload, X, AlertTriangle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { UploadProgressBar } from './UploadProgressBar'
import { UploadProgress } from '@/types'

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void
  mimeTypes?: string[]
  isUploading: boolean
  uploadProgress: UploadProgress | null
  error: string | null
  onCancelUpload: () => void
  className?: string
}

export function DropZone({
  onDrop,
  mimeTypes,
  isUploading,
  uploadProgress,
  error,
  onCancelUpload,
  className,
}: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mimeTypes ? Object.fromEntries(mimeTypes.map((type) => [type, []])) : undefined,
    multiple: false,
    maxSize: 5 * 1024 * 1024 * 1024, // 5GB
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        `relative flex flex-col items-center justify-center w-full border-2 border-dashed 
        rounded-xl bg-[#232652] hover:bg-[#2c2f5e] transition-all duration-200
        ${isDragActive ? 'border-[#7849de] bg-[#2c2f5e]' : 'border-[#384455]'}
        ${isUploading ? 'h-40' : 'h-32'}`,
        className,
      )}
    >
      <input {...getInputProps()} />

      {isUploading && uploadProgress ? (
        <UploadProgressBar progress={uploadProgress} />
      ) : (
        <div className="text-center p-4">
          <Upload className="mx-auto h-12 w-12 text-[#809fb8] mb-2" />
          <p className="text-[#809fb8] text-sm">
            {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-[#809fb8] mt-1">
            Max size: 5GB • {mimeTypes?.join(', ') || 'All formats'}
          </p>
        </div>
      )}

      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-red-500 text-sm flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {isUploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCancelUpload()
          }}
          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white
            hover:bg-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
