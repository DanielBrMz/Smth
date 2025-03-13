'use client'
import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { LoadingWheel } from '@/components/shared/LoadingScreen'

export interface Props {
  appearance?: 'default' | 'none' | 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  el?: 'a' | 'button' | 'link'
  href?: string
  invert?: boolean
  label?: string
  newTab?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'purple' | 'green' | 'dark' | 'dark_w' | 'gray_w'
  isLoading?: boolean
}

export const Button: React.FC<Props> = ({
  className,
  disabled = false,
  el = 'button',
  href,
  label,
  newTab = false,
  onClick,
  type = 'button',
  variant = 'purple',
  isLoading = false, // Add this prop
}) => {
  const colorClasses = !disabled
    ? {
        purple: 'bg-[#7849de] text-white border-solid border-[#7849de]',
        green: 'bg-[#1bb7a0] text-white border-[#1bb7a0]',
        dark: 'bg-[#010022] text-white outline outline-soft_purple hover:bg-soft_purple border-soft_purple',
        dark_w:
          'bg-[#010022] text-white outline outline-2 outline-white hover:bg-soft_purple hover:outline-soft_purple border-white',
        gray_w:
          'bg-[#292c3b] text-white outline outline-2 outline-white hover:outline-white border-white',
      }
    : {
        purple: 'bg-[#24165a] text-gray-500 border-solid border-[#24165a]',
        green: 'bg-[#0f7b76] text-gray-500 border-[#0f7b76]',
        dark: 'bg-[#010022] text-gray-500 outline outline-red-400 border-red-400',
        dark_w: 'bg-[#010022] text-gray-500 outline outline-white border-white',
        gray_w: 'bg-[#010022] text-gray-500 outline outline-white border-white',
      }

  if (el === 'link' && href) {
    return (
      <Link
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={clsx(
          'min-h-auto text-md fully_animated flex h-16 w-full items-center justify-center rounded-xl px-7 pb-2.5 pt-3 text-lg font-bold leading-normal active:scale-95 border-2',
          colorClasses[variant],
          {
            'opacity-50 cursor-not-allowed': disabled || isLoading,
            'transform transition-transform duration-200 hover:scale-105': !disabled && !isLoading,
          },
          className,
        )}
        onClick={onClick}
      >
        {isLoading ? <LoadingWheel size="6" /> : label}
      </Link>
    )
  }

  const Element = el === 'a' ? 'a' : 'button'
  return (
    <Element
      {...(el === 'a' ? { href, role: 'button' } : {})}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={clsx(
        'min-h-auto text-md fully_animated flex h-16 w-full items-center justify-center rounded-xl px-7 pb-2.5 pt-3 text-lg font-bold leading-normal active:scale-95 border-2',
        colorClasses[variant],
        {
          'opacity-50 cursor-not-allowed': disabled || isLoading,
          'transform transition-transform duration-200 hover:scale-105': !disabled && !isLoading,
        },
        className,
      )}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
    >
      {isLoading ? <LoadingWheel size="6" /> : label}
    </Element>
  )
}
