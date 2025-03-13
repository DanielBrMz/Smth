'use client'

import React, { JSX, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { InsightHeader } from '@/components/insights/InsightHeader'
import { InsightForm } from '@/components/insights/InsightForm'
import { InsightSidebar } from '@/components/insights/InsightSidebar'
import LoadingScreen from '@/components/shared/LoadingScreen'
import ConfirmationModal from '@/components/shared/ConfirmationModal'
import { useInsight } from '@/hooks/useInsight'
import { InsightFormData, InsightFormDataWithContents, InsightPayload, MediaItem } from '@/types'

export default function InsightPage(): JSX.Element {
  const router = useRouter()
  const { id } = useParams()
  const {
    insight,
    contentType,
    setContentType,
    isLoading,
    error,
    mediaSource,
    isMediaModalOpen,
    showConfirmation,
    pendingMediaUpdate,
    handleUploadComplete,
    removeMedia,
    setIsMediaModalOpen,
    setShowConfirmation,
    setMediaSource,
    setTemporaryContentId,
    temporaryContentId,
  } = useInsight(id as string)

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
  } = useForm<InsightFormDataWithContents>({
    defaultValues: {
      description: {
        root: {
          type: 'root',
          format: undefined,
          indent: 0,
          version: 1,
          children: [],
          direction: 'ltr',
        },
      },
      contents: null,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const watchTitle = watch('title', '')

  // Set form values when insight data is loaded
  useEffect(() => {
    if (insight && id !== 'new') {
      // Parse description if it's a string
      const description =
        typeof insight.description === 'string'
          ? JSON.parse(insight.description)
          : insight.description

      reset({
        title: insight.title,
        description: description,
        insight_location: insight.insight_location,
        review_status: insight.review_status,
        state: insight.state,
        review_commentary: insight.review_commentary,
        contents: insight.contents?.id ? parseInt(insight.contents.id, 10) : null,
      })

      // If there's a media content, set it
      if (insight.contents) {
        setMediaSource({
          url: insight.contents.streamingUrl || insight.contents.url,
          mimeType: insight.contents.mimeType,
        })
        setTemporaryContentId(insight.contents.id)
      }
    }
  }, [insight, id, reset, setMediaSource, setTemporaryContentId])

  const onSubmit: SubmitHandler<InsightFormData> = async (data) => {
    if (data.title.length < 5 || data.title.length > 400) {
      toast.error('Title should be between 5 and 400 characters.')
      return
    }

    try {
      const isNewInsight = id === 'new'
      const method = isNewInsight ? 'POST' : 'PATCH'
      const url = isNewInsight ? '/api/insights' : `/api/insights/${id}`

      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/endorsers/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const userData = await userResponse.json()

      const payload: InsightPayload = {
        title: data.title,
        description: JSON.stringify(data.description),
        insight_location: data.insight_location || 'Welcome Video',
        review_status: data.review_status || 'todo',
        state: data.state || 'Draft',
        review_commentary: data.review_commentary || '',
        metadata: {
          onLogIn: true,
          default: false,
        },
        createdBy: userData.user.id,
        contents: pendingMediaUpdate
          ? parseInt(pendingMediaUpdate.id, 10)
          : temporaryContentId
            ? parseInt(temporaryContentId, 10)
            : null,
      }

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || 'Failed to save insight')
      }

      if (pendingMediaUpdate) {
        setMediaSource({
          url: pendingMediaUpdate.url,
          mimeType: pendingMediaUpdate.mimeType,
        })
        setTemporaryContentId(pendingMediaUpdate.id)
      }

      const responseData = await response.json()

      setShowConfirmation(true)
      toast.success(isNewInsight ? 'Insight created!' : 'Insight updated!')

      if (isNewInsight && responseData.doc.id) {
        setTimeout(() => {
          router.push(`/endorser/dashboard/insights/${responseData.doc.id}`)
        }, 1500)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      console.error('Error in onSubmit:', errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleMediaUploadComplete = (media: MediaItem) => {
    handleUploadComplete(media)
  }

  const handleSendToReview = () => {
    setValue('review_status', 'sent_to_review')
    handleSubmit(onSubmit)()
  }

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>
  }

  return (
    <>
      <LoadingScreen />
      <ConfirmationModal
        isOpen={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Success!"
        message={id === 'new' ? 'Insight created successfully' : 'Insight updated successfully'}
      />
      <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
        <InsightHeader watchTitle={watchTitle} onSendToReview={handleSendToReview} />

        <div className="flex mt-12 gap-6">
          <InsightForm
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            mediaSource={mediaSource}
            handleUploadComplete={handleMediaUploadComplete}
            removeMedia={removeMedia}
            isMediaModalOpen={isMediaModalOpen}
            setIsMediaModalOpen={setIsMediaModalOpen}
            insightFileSize={insight?.contents?.filesize}
            isSubmitting={isSubmitting}
          />

          <InsightSidebar
            contentType={contentType}
            setContentType={setContentType}
            setValue={setValue}
            insight={insight}
            isNew={id === 'new'}
          />
        </div>
      </form>
    </>
  )
}
