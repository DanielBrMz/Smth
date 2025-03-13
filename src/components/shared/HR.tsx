import React from 'react'

export const HR: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props

  return (
    <hr
      className={[
        className,
        'my-[calc(var(--block-padding)_/_2)] border-none bg-[var(--theme-elevation-200)] h-[1px]',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
