'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPlayer } from '@/components/insights/MediaPlayer'
import MultiUploadArea from '@/components/insights/MultiUploadArea'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, FileVideo, Calendar, HardDrive } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'

interface MediaItem {
  id: number
  filename: string
  mimeType: string
  filesize: number
  url: string
  streamingUrl: string
  createdAt: string
}

const getDisplayFilename = (filename: string): string => {
  const parts = filename.split('-')
  return parts[parts.length - 1] // Gets the last part after the hyphen
}

export default function Page() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, setSelectedItem] = useState<MediaItem | null>(null)
  const [, setUploadProgress] = useState(0)
  const [showUploadArea, setShowUploadArea] = useState(false)
  const [, setCompletedUploads] = useState(0)
  const [totalUploads, setTotalUploads] = useState(0)

  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadStart = (totalFiles: number) => {
    setTotalUploads(totalFiles)
    setCompletedUploads(0)
  }

  const handleUploadComplete = async (_fileMeta: { id: string }) => {
    setCompletedUploads((prev) => {
      const newCount = prev + 1
      // Only close and reset when all uploads are done
      if (newCount === totalUploads) {
        setShowUploadArea(false)
        setUploadProgress(0)
        setTotalUploads(0)
      }
      return newCount
    })

    await fetchMediaItems()
  }
  const handleDeleteMedia = async (id: number) => {
    setIsDeleting(id)
    setDeleteError(null)

    try {
      // First get the media details to get the key
      const mediaResponse = await fetch(`/api/contents/${id}`)
      if (!mediaResponse.ok) {
        throw new Error('Failed to fetch media details')
      }
      const mediaData = await mediaResponse.json()
      const key = mediaData.key // This is the R2 object key

      // Delete from Payload CMS
      const payloadResponse = await fetch(`/api/contents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!payloadResponse.ok) {
        throw new Error('Failed to delete media from Payload')
      }

      // Delete from R2
      const r2Response = await fetch(`/api/contents/delete-object/${key}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!r2Response.ok) {
        throw new Error('Failed to delete media from R2')
      }

      setMediaItems((prev) => prev.filter((item) => item.id !== id))
      setSelectedItem(null)
    } catch (error) {
      console.error('Error deleting media:', error)
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete media')
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080828] p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading media gallery...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex p-0 w-full bg-[#11142f] rounded-[0.625rem] px-6 pt-7 pb-9 flex-col">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <Button
            onClick={() => setShowUploadArea(true)}
            className="bg-[#7849DE] hover:bg-[#5a37a6] text-white"
          >
            Upload New Media
          </Button>
        </div>

        {showUploadArea && (
          <div className="mb-8">
            <MultiUploadArea
              onUploadComplete={handleUploadComplete}
              onUploadStart={handleUploadStart}
              onProgress={setUploadProgress}
              mimeTypes={['video/*']}
              className="bg-[#11142f] border-[#384455]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#11142f] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#7849DE] transition-all duration-200"
            >
              <div className="relative aspect-video bg-black">
                <MediaPlayer src={item.streamingUrl} mimeType={item.mimeType} />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-medium truncate flex-1">
                    {getDisplayFilename(item.filename)}
                  </h3>{' '}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#11142f] border-[#384455] rounded-xl p-6 max-w-md w-full">
                      <AlertDialogHeader className="space-y-3">
                        <AlertDialogTitle className="text-2xl font-bold text-white">
                          Delete Media
                        </AlertDialogTitle>
                        <p className="text-[#809fb8] text-base">
                          Are you sure you want to delete{' '}
                          <span className="text-white font-medium">
                            {getDisplayFilename(item.filename)}
                          </span>
                          ? This action cannot be undone.
                        </p>
                      </AlertDialogHeader>

                      {deleteError && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 text-sm">{deleteError}</p>
                        </div>
                      )}

                      <AlertDialogFooter className="flex space-x-3 mt-6">
                        <AlertDialogCancel className="flex-1 bg-[#232652] text-white hover:bg-[#2c2f5e] border-[#384455]">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                          disabled={isDeleting === item.id}
                        >
                          {isDeleting === item.id ? (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Deleting...</span>
                            </div>
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-[#809fb8]">
                    <FileVideo className="h-4 w-4 mr-2" />
                    <span>{item.mimeType}</span>
                  </div>
                  <div className="flex items-center text-[#809fb8]">
                    <HardDrive className="h-4 w-4 mr-2" />
                    <span>{formatBytes(item.filesize)}</span>
                  </div>
                  <div className="flex items-center text-[#809fb8]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mediaItems.length === 0 && !showUploadArea && (
          <div className="flex flex-col items-center justify-center h-64 text-[#809fb8]">
            <FileVideo className="h-16 w-16 mb-4" />
            <p className="text-lg mb-2">No media files found</p>
            <Button
              onClick={() => setShowUploadArea(true)}
              className="bg-[#7849DE] hover:bg-[#5a37a6] text-white mt-4"
            >
              Upload Your First Media
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
