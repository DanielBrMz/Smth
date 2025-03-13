import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Audience Data for Endorsers',
  description: 'Check how your Sidepocket Branch is doing',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>{children}</>
    </>
  )
}
