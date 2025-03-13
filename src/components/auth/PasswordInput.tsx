'use client'

import clsx from 'clsx'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label_text: string // Label for the input field
  password: string // Password value
  setPassword: (password: string) => void // Function to update the password
  confirmPassword?: string // Optional confirmPassword for validation
  showPassword?: boolean // State to control password visibility
  setShowPassword?: (prevVisible: boolean) => void // Function to toggle password visibility
}

// React functional component for password input with validation and visibility toggle.
export function PasswordInput({
  label_text,
  password,
  setPassword,
  confirmPassword,
  showPassword = false,
  setShowPassword,
  className,
  ...props
}: PasswordInputProps) {
  // Local state to track empty and invalid password conditions, and input focus.
  const [passwordEmpty, setPasswordEmpty] = useState(true)
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  // Validates the password according to specific rules and checks match against confirmPassword.
  function passwordRegex(passwordString: string, confirmPasswordString = '') {
    const re = {
      capital: /[A-Z]/, // Must contain a capital letter
      digit: /[0-9]/, // Must contain a digit
      except: /[aeiou]/, // Must not contain lowercase vowels
      full: /^[@#][A-Za-z0-9]{7,13}$/, // Must start with @ or # and be 7-13 characters long
    }

    if (passwordString !== confirmPasswordString) {
      return false
    }

    // Returns true only if all conditions are met.
    return (
      re.capital.test(password) &&
      re.digit.test(password) &&
      !re.except.test(password) &&
      re.full.test(password)
    )
  }

  // Validates the password and updates the passwordInvalid state.
  const validatePassword = (inputPassword: string, confirmPasswordString = '') => {
    setPasswordInvalid(!passwordRegex(inputPassword, confirmPasswordString))
  }

  // Toggles the password visibility state.
  const togglePasswordVisibility = (event: React.MouseEvent) => {
    event.preventDefault()
    if (setShowPassword) setShowPassword(!showPassword)
    else setIsPasswordVisible((prevVisible) => !prevVisible)
  }

  // Sets the input field focus state.
  const inFocus = () => setIsFocused(true)
  const unfocused = () => setIsFocused(false)

  // Handles password input changes, updates the password state, and validates the new password.
  const handlePasswordChange = (e: { target: { value: string } }) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordEmpty(newPassword === '')
    validatePassword(newPassword, confirmPassword)
  }

  return (
    <label
      htmlFor={confirmPassword !== undefined ? 'confirmPassword' : 'password'}
      className={clsx('relative flex h-16 w-full items-center justify-center', className)}
    >
      <input
        required
        type={showPassword || isPasswordVisible ? 'text' : 'password'}
        name={confirmPassword !== undefined ? 'confirmPassword' : 'password'}
        id={confirmPassword !== undefined ? 'confirmPassword' : 'password'}
        value={password}
        onChange={handlePasswordChange}
        onFocus={inFocus}
        onBlur={unfocused}
        className={clsx(
          'password-input peer h-full w-full rounded-2xl border-2 border-[#384455] bg-gray-700 bg-opacity-30 px-8 py-2 text-white outline-none duration-200 hover:border-gray-400 focus:border-indigo-600',
          {
            'invalid:text-red-500': passwordInvalid,
          },
        )}
        pattern="^.{8,}"
        {...props}
      />
      <span
        className={clsx(
          'text-4 pointer-events-none absolute left-8 top-5 h-fit w-fit border-none text-[#888a97] duration-200',
          {
            '-translate-x-2 -translate-y-[37px] text-[0.75rem] text-indigo-600 peer-focus:text-indigo-600':
              !passwordEmpty || isFocused,
          },
        )}
      >
        {label_text}
      </span>
      <button
        className="absolute right-1 mr-4 flex h-8 w-8 items-center justify-center"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          togglePasswordVisibility(event)
        }}
      >
        {showPassword || isPasswordVisible ? (
          <EyeIcon className="h-6 w-6 stroke-white " />
        ) : (
          <EyeOffIcon className="h-6 w-6 stroke-white" />
        )}
      </button>
    </label>
  )
}
