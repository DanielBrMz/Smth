import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Media Library',
  description: 'Upload and manage your media files',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>{children}</>
    </>
  )
}
