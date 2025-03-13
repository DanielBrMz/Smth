import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Password Recovery Email',
  description: 'Enter your email to recover your password.',
}

export default function ValidationEmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-screen bg-[#010022]">
      {/* Background image and gradient */}
      <div
        className="absolute z-0 h-screen w-screen bg-opacity-5 bg-validate_email_bg bg-cover bg-no-repeat"
        style={{ backgroundPosition: 'center center' }}
      ></div>
      {/* Wrapper */}
      <div className="z-50 flex min-h-max w-full flex-col items-center justify-start">
        {children}
      </div>
    </main>
  )
}
