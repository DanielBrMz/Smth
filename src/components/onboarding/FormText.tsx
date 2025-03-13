'use client'

import React from 'react'

interface FormTextProps extends React.PropsWithChildren {
  titleText: string
  bodyText: React.ReactNode
  noteText?: string
  insight_location?: string
}

function FormText({ titleText, bodyText, noteText }: FormTextProps) {
  return (
    <div className="flex h-fit w-full flex-col space-y-[0.2rem] text-left">
      <h1 className="text-[1.5rem] font-semibold text-white">{titleText}</h1>
      <span className="text-[1.0625rem] text-white">{bodyText}</span>
      {noteText && <span className="pt-4 text-[.8375rem] text-white">{noteText}</span>}
    </div>
  )
}

export default FormText
