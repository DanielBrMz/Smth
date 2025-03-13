import React, { forwardRef } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  left?: boolean
  right?: boolean
}

export const Gutter = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, className, left = true, right = true } = props

  const baseClasses = 'max-w-[1920px] mx-auto'
  const leftClasses = 'pl-[var(--gutter-h)]'
  const rightClasses = 'pr-[var(--gutter-h)]'

  return (
    <div
      className={[baseClasses, left ? leftClasses : '', right ? rightClasses : '', className]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      {children}
    </div>
  )
})

Gutter.displayName = 'Gutter'
