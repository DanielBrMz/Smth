import clsx from 'clsx'
import { useEffect, useState, ChangeEvent } from 'react'
import { UseFormRegister, FieldError, Path, FieldValues } from 'react-hook-form'

interface InputProps<TFormValues extends FieldValues> {
  disabled?: boolean
  error?: FieldError
  label?: string
  name: Path<TFormValues>
  placeholder?: string
  register: UseFormRegister<TFormValues>
  required?: boolean
  type?: 'email' | 'number' | 'password' | 'text' | 'textarea'
  validate?: (value: string) => boolean | string
  className?: string
}

export const Input = <TFormValues extends FieldValues>({
  disabled,
  error,
  label,
  name,
  placeholder,
  register,
  required,
  type = 'text',
  validate,
  className,
}: InputProps<TFormValues>) => {
  const [isEmpty, setIsEmpty] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const { onChange, onBlur, ref } = register(name, {
    required,
    validate,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsEmpty(event.target.value === '')
    if (validate) {
      const validationResult = validate(event.target.value)
      setIsValid(validationResult === true)
    }
    onChange(event)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false)
    setIsEmpty(event.target.value === '')
    onBlur(event)
  }

  useEffect(() => {
    setIsEmpty(true)
  }, [])

  const inputClassNames = clsx(
    'peer h-full w-full rounded-2xl border-2 bg-gray-700 bg-opacity-30 px-8 py-2 text-white outline-none duration-200',
    'invalid:text-red-500 hover:border-gray-400',
    disabled && 'opacity-50 cursor-not-allowed',
    !isValid ? 'text-red-500 border-red-500' : 'focus:border-indigo-600',
  )

  const textareaClassNames = clsx(
    'peer h-full w-full rounded-2xl border-2 border-[#384455] bg-gray-700 bg-opacity-30 px-8 py-4 text-white outline-none duration-200',
    'invalid:text-red-500 hover:border-gray-400 focus:border-indigo-600',
    disabled && 'opacity-50 cursor-not-allowed',
  )

  const labelClassNames = clsx(
    'absolute left-8 top-5 text-[#888a97] duration-200 pointer-events-none',
    {
      '-translate-x-2 -translate-y-[50px] text-[0.75rem] text-indigo-600': !isEmpty || isFocused,
    },
  )

  return (
    <label htmlFor={name} className={clsx('relative h-16 w-full', className)}>
      {type !== 'textarea' ? (
        <input
          style={{ border: '2px solid #384455' }}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={ref as React.Ref<HTMLInputElement>}
          className={inputClassNames}
        />
      ) : (
        <textarea
          style={{ border: '2px solid #384455' }}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={textareaClassNames}
        />
      )}

      {label && <span className={labelClassNames}>{label}</span>}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </label>
  )
}
