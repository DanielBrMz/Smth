'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  value: string
  setValue: (value: string) => void
}

export const LargeInput = ({ label, value, setValue, name, id, ...props }: TextAreaProps) => {
  const [textEmpty, setTextEmpty] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const handleTextChange = (e: { target: { value: string } }) => {
    setValue(e.target.value)
    setTextEmpty(e.target.value === '')
  }

  const inFocus = () => setIsFocused(true)
  const unfocused = () => setIsFocused(false)

  useEffect(() => {
    setTextEmpty(value === '')
  }, [value])

  return (
    <label htmlFor="textarea-field" className="relative h-48 w-full">
      <textarea
        name={name}
        id={id}
        value={value}
        onChange={handleTextChange}
        onFocus={inFocus}
        onBlur={unfocused}
        className="textarea-input peer h-full w-full resize-none rounded-2xl border-2 border-[#384455] bg-gray-700 bg-opacity-30 px-8 py-4 text-white outline-none duration-200 invalid:text-red-500 hover:border-gray-400 focus:border-indigo-600"
        {...props}
      />
      <span
        className={clsx(
          'pointer-events-none absolute left-8 top-4 h-fit w-fit border-none text-[#888a97] duration-200',
          {
            '-translate-x-2 -translate-y-[35px] text-[0.75rem] text-indigo-600 peer-focus:text-indigo-600':
              !textEmpty || isFocused,
          },
        )}
      >
        {label}
      </span>
    </label>
  )
}
