'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const VerifyEmail = dynamic(() => import('./VerifyEmail'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  )
}

export default Page
