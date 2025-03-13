import React, { useState } from 'react'
import Image from 'next/image'
import image from '@/../public/sidepocket_logo.png'

interface LogoProps {
  brandId: string
  existingLogoUrl?: string
}

export const LogoUpload: React.FC<LogoProps> = ({ brandId, existingLogoUrl }) => {
  const [logoUrl, setLogoUrl] = useState<string>(existingLogoUrl || image.src)

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData()
      formData.append('file', event.target.files[0])

      try {
        // Assuming you have a serverless function or API route to handle file uploads
        const response = await fetch('/api/upload-logo', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (response.ok && data.logoUrl) {
          // Update the brand with the new logo
          const updateResponse = await fetch(`/api/brands/${brandId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              logo: data.logoUrl,
            }),
          })

          if (updateResponse.ok) {
            setLogoUrl(data.logoUrl)
          }
        }
      } catch (error) {
        console.error('Error uploading logo:', error)
      }
    }
  }

  return (
    <div className="logo-container relative group">
      <Image
        src={logoUrl}
        alt="Brand logo"
        width={0}
        height={0}
        sizes="40vw"
        className=" h-auto w-auto"
        priority
      />
      <div className="logo-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <label className="cursor-pointer text-white">
          <span>Upload Logo</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
        </label>
      </div>
    </div>
  )
}
