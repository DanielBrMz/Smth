import { Controller, Control, UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/shared/Input'
import UploadArea from '@/components/insights/UploadArea'
import CustomRichTextEditor from '@/components/insights/CustomRichTextEditor'
import { JSX } from 'react'
import { InsightFormData, MediaSource, MediaItem } from '@/types'

type InsightFormDataWithContents = InsightFormData & {
  contents?: number | null
}

interface InsightFormProps {
  control: Control<InsightFormDataWithContents>
  register: UseFormRegister<InsightFormDataWithContents>
  setValue: UseFormSetValue<InsightFormDataWithContents>
  errors: FieldErrors<InsightFormDataWithContents>
  mediaSource: MediaSource | null
  handleUploadComplete: (fileMeta: MediaItem) => void
  removeMedia: () => void
  isMediaModalOpen: boolean
  setIsMediaModalOpen: (open: boolean) => void
  insightFileSize?: number
  isSubmitting?: boolean
}

export function InsightForm({
  control,
  register,
  setValue,
  errors,
  mediaSource,
  handleUploadComplete,
  removeMedia,
  isMediaModalOpen,
  setIsMediaModalOpen,
  insightFileSize,
  isSubmitting = false,
}: InsightFormProps): JSX.Element {
  const handleUploadSelection = (media: MediaItem) => {
    setValue('contents', parseInt(media.id, 10))
    handleUploadComplete(media)
  }

  const handleMediaRemove = () => {
    setValue('contents', null)
    removeMedia()
  }

  return (
    <div className="bg-[#11142f] w-1/2 max-w-[42.5rem] min-h-[34rem] rounded-2xl px-6 pt-9 pb-7">
      <h6 className="text-[#809fb8] m-0">
        Please input a title and description for your insight below.
      </h6>

      <Input
        placeholder="Write title here..."
        name="title"
        register={register}
        error={errors.title}
        type="text"
        required
        // Remove direct validation here
        className="block h-16 mt-7"
      />

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <div className="mt-5">
              <CustomRichTextEditor
                onChange={onChange}
                value={value}
                className="min-h-[12.5rem] font-lato"
                placeholder="Write your description here..."
              />
            </div>
          )
        }}
      />

      <div className="mt-5">
        <label htmlFor="media" className="block text-[#809fb8] mb-2">
          Upload Media (Images or Videos)
        </label>

        <UploadArea
          mimeTypes={['video/*', 'image/*']}
          onUploadComplete={handleUploadSelection}
          currentMedia={mediaSource}
          onRemoveMedia={handleMediaRemove}
          isModalOpen={isMediaModalOpen}
          onModalOpenChange={setIsMediaModalOpen}
          fileSize={insightFileSize}
          className="bg-[#11142f] border-[#384455]"
        />

        {errors.contents && <p className="text-red-500 text-sm mt-1">{errors.contents.message}</p>}
      </div>

      {isSubmitting && (
        <div className="mt-4 text-[#809fb8] text-sm">Saving insight... Please wait.</div>
      )}
    </div>
  )
}

export default InsightForm
