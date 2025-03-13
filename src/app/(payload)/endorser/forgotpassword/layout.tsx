import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password.',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-screen bg-[#010022] px-4">
      {/* Wrapper */}
      <div className="flex min-h-max w-full flex-col items-center justify-start">{children}</div>
    </main>
  )
}
