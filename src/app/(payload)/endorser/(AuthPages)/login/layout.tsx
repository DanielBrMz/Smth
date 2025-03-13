import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Signin page for Sidepocket',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
