import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Insights description',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>{children}</>
    </>
  )
}
