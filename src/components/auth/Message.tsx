import React from 'react'

export const Message: React.FC<{
  className?: string
  error?: React.ReactNode
  message?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
}> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  const baseClasses = 'p-[calc(var(--base)_/_1.5)] leading-5 w-full'
  const defaultClasses = 'bg-[var(--theme-elevation-100)] text-[var(--theme-elevation-1000)]'
  const warningClasses = 'bg-[var(--theme-warning-500)] text-[var(--theme-warning-900)]'
  const errorClasses = 'bg-[var(--theme-error-500)] text-[var(--theme-error-900)]'
  const successClasses = 'bg-[var(--theme-success-500)] text-[var(--theme-success-900)]'

  const darkModeClasses = {
    default: 'dark:bg-[var(--theme-elevation-900)] dark:text-[var(--theme-elevation-100)]',
    warning: 'dark:text-[var(--theme-warning-100)]',
    error: 'dark:text-[var(--theme-error-100)]',
    success: 'dark:text-[var(--theme-success-100)]',
  }

  if (messageToRender) {
    return (
      <div
        className={[
          baseClasses,
          className,
          error ? errorClasses : '',
          success ? successClasses : '',
          warning ? warningClasses : '',
          !error && !success && !warning ? defaultClasses : '',
          error ? darkModeClasses.error : '',
          success ? darkModeClasses.success : '',
          warning ? darkModeClasses.warning : '',
          !error && !success && !warning ? darkModeClasses.default : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {messageToRender}
      </div>
    )
  }
  return null
}
