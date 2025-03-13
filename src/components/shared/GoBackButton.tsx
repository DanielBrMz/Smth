import React from 'react'
import { ChevronLeftIcon } from 'lucide-react'

const GoBackButton = ({
  text,
  className = '',
  navigateTo, // Optional prop for custom navigation
  onCustomClick, // Optional prop for custom click handler
}: {
  text: string
  className?: string
  navigateTo?: string
  onCustomClick?: () => void
}) => {
  const goBack = () => {
    if (onCustomClick) {
      onCustomClick() // If there's a custom click handler, use it
    } else if (navigateTo) {
      window.location.href = navigateTo // Navigate to custom URL if provided
    } else {
      window.history.back() // Default go back behavior
    }
  }

  return (
    <button
      onClick={goBack}
      className={`flex w-fit select-none items-center text-base font-bold text-white caret-transparent hover:underline ${className}`}
    >
      <ChevronLeftIcon className="mb-[2px] mr-3 h-5 w-5" />
      {text}
    </button>
  )
}

export default GoBackButton
