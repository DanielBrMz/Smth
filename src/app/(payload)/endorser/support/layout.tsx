import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Contact usa',
  description: 'Send us an Email.',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>{children}</>
    </>
  )
}
