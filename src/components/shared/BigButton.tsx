import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  linkTo?: string
  as?: string
  isEnabled?: boolean
  variant?: 'purple' | 'green' | 'dark' | 'dark_w' | 'gray_w'
  disableLoading?: boolean
  isLitePlan?: boolean // Add this new prop
}

export default function BigButton({
  linkTo,
  as,
  isEnabled = true, // Assume button is enabled by default
  variant = 'purple',
  isLitePlan = false, // Default to false
  ...props
}: BigButtonProps) {
  // Determine color classes based on variant and if the button is enabled
  const colorClasses = isEnabled
    ? {
        purple: 'bg-[#7849de] text-white',
        green: 'bg-[#1bb7a0] text-white',
        dark: 'bg-[#010022] text-white outline outline-soft_purple hover:bg-soft_purple',
        dark_w:
          'bg-[#010022] text-white outline outline-2 outline-white hover:bg-soft_purple hover:outline-soft_purple',
        gray_w: 'bg-[#292c3b] text-white outline outline-2 outline-white hover:outline-white',
      }
    : {
        purple: 'bg-[#24165a] text-gray-500',
        green: 'bg-[#0f7b76] text-gray-500',
        dark: 'bg-[#010022] text-gray-500 outline outline-red-400',
        dark_w: 'bg-[#010022] text-gray-500 outline outline-white',
        gray_w: 'bg-[#010022] text-gray-500 outline outline-white',
      }

  // Apply Lite plan specific color based on isEnabled
  const appliedColorClasses = isLitePlan
    ? isEnabled
      ? 'bg-[#1bb7a0] text-white'
      : 'bg-[#0f7b76] text-gray-500' // More gray color to indicate not enabled
    : colorClasses[variant]

  const button = (
    <button
      className={clsx(
        'min-h-auto text-md fully_animated flex h-16 w-full items-center justify-center rounded-xl px-7 pb-2.5 pt-3 text-lg font-bold leading-normal active:scale-95',
        appliedColorClasses,
        { scaled_hover: isEnabled },
      )}
      data-te-ripple-init
      data-te-ripple-color="light"
      disabled={!isEnabled}
      {...props}
    ></button>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} as={as} className="h-full w-full">
        {button}
      </Link>
    )
  }

  return button
}
