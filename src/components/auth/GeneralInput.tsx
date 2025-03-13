'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface EmailProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  value: string
  setValue: (value: string) => void
}

export const GeneralInput = ({
  label,
  value: email,
  setValue: setEmail,
  name,
  id,
  ...props
}: EmailProps) => {
  const [emailEmpty, setEmailEmpty] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const handleEmailChange = (e: { target: { value: string } }) => {
    setEmail(e.target.value)
    setEmailEmpty(e.target.value === '')
  }

  const inFocus = () => setIsFocused(true)
  const unfocused = () => setIsFocused(false)

  useEffect(() => {
    setEmailEmpty(email === '')
  }, [email])

  return (
    <label htmlFor="email-field" className="relative h-16 w-full">
      <input
        name={name}
        id={id}
        value={email}
        onChange={handleEmailChange}
        onFocus={inFocus}
        onBlur={unfocused}
        className="email-input peer h-full w-full rounded-2xl border-2 border-[#384455] bg-gray-700 bg-opacity-30 px-8 py-2 text-white outline-none  duration-200 invalid:text-red-500 hover:border-gray-400 focus:border-indigo-600"
        {...props}
      />
      <span
        className={clsx(
          'text-4 pointer-events-none absolute left-8 top-5 h-fit w-fit border-none text-[#888a97] duration-200',
          {
            '-translate-x-2 -translate-y-[37px] text-[0.75rem] text-indigo-600 peer-focus:text-indigo-600':
              !emailEmpty || isFocused,
          },
        )}
      >
        {label}
      </span>
    </label>
  )
}
