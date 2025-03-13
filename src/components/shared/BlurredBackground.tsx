import React from 'react'

type Props = {
  active: boolean
  children?: React.ReactNode
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50
}

export default function BlurredBackground({ children, active, zIndex = 40 }: Props) {
  return (
    active && (
      <div
        className={`fixed left-0 top-0 z-${zIndex?.toString()} z flex h-screen w-screen items-center justify-center bg-gray-900 bg-opacity-30 backdrop-blur-[2px]`}
      >
        {children}
      </div>
    )
  )
}
