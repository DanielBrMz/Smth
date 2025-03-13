import React from 'react'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'

interface LinkButtonProps extends React.PropsWithChildren {
  link: string
  text: string
  className?: string
}

export default function LinkButton({ link, text, className }: LinkButtonProps) {
  return (
    <>
      <Link
        href={link}
        className={`flex w-fit select-none items-end text-base font-bold text-white caret-transparent hover:underline ${className}`}
      >
        <ChevronLeftIcon className="mb-[2px] mr-3 h-5 w-5" />
        {text}
      </Link>
    </>
  )
}
