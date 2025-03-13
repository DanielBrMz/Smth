import { User, MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import BlurredBackground from '@/components/shared/BlurredBackground'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface ProfileButtonProps {
  email: string
  name: string
  onLogout: () => Promise<void>
}

export default function ProfileButton({ email, name, onLogout }: ProfileButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [profilePicUrl, setProfilePicUrl] = useState<string>('')

  // Fetch initial profile picture
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch('/api/endorsers/me', {
          credentials: 'include',
        })
        const data = await response.json()
        if (data.user?.profilePicture?.url) {
          setProfilePicUrl(data.user.profilePicture.url)
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error)
      }
    }

    fetchProfilePic()
  }, [])

  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return

    setIsLoading(true)
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      // First upload to media collection
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!mediaResponse.ok) {
        throw new Error('Failed to upload media')
      }

      const mediaData = await mediaResponse.json()

      // Then update the user with the new media ID
      const updateResponse = await fetch('/api/endorsers/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          profilePicture: mediaData.id,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile')
      }

      const userData = await updateResponse.json()
      if (userData.profilePicture?.url) {
        setProfilePicUrl(userData.profilePicture.url)
        toast.success('Profile picture updated successfully')
      }
    } catch (error) {
      console.error('Error updating profile picture:', error)
      toast.error('Failed to update profile picture')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowModal(false)
    }
  }, [])

  useLayoutEffect(() => {
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  const [portalElement, setPortalElement] = useState<Element | null>(null)
  const isClient = typeof window === 'object'

  useEffect(() => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    setPortalElement(div)

    return () => {
      if (document.body.contains(div)) {
        document.body.removeChild(div)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await onLogout()
      setShowModal(false)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="relative hidden md:block">
      <button
        ref={buttonRef}
        className="z-10 ml-[2rem] flex h-14 w-14 items-center justify-center rounded-full bg-[#384455] outline-1 outline-white hover:outline"
        onClick={() => setShowModal(!showModal)}
        disabled={isLoading}
      >
        {profilePicUrl ? (
          <Image
            src={profilePicUrl}
            alt="Profile"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <User className="h-6 w-6 stroke-white" />
        )}
      </button>
      {showModal &&
        isClient &&
        portalElement &&
        createPortal(
          <>
            <BlurredBackground active={showModal} zIndex={50} />
            <div
              ref={modalRef}
              className="absolute right-4 top-16 z-50 mr-7 mt-2 flex min-h-[30rem] min-w-[22rem] flex-col justify-between space-y-8 rounded-[0.8rem] border-solid border-1 bg-[#121526] p-8 font-semibold text-white shadow-lg"
              style={{
                boxShadow: '0px 0px 7px #000',
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">User Profile</h2>
                <button disabled={isLoading}>
                  <MoreHorizontal className="h-10 w-10 text-slate-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="group relative">
                    {profilePicUrl ? (
                      <Image
                        src={profilePicUrl}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#292c3b]">
                        <User className="h-10 w-10 stroke-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <label className="cursor-pointer text-white">
                        <span>{isLoading ? 'Uploading...' : 'Change Picture'}</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicUpload}
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-0 h-[1.1rem] w-[1.1rem] rounded-full border-4 border-solid border-slate-700 bg-green-500"></span>
                </div>
                {name && <p className="text-xl font-semibold">{name}</p>}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs tracking-widest text-slate-400">EMAIL</span>
                <p className="text-md font-medium">{email}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : 'Logout'}
              </button>
            </div>
          </>,
          portalElement,
        )}
    </div>
  )
}
