'use client'

import React, { useActionState, useEffect, useState } from 'react'
import FormLayout from '@/components/onboarding/FormLayout'
import { Button } from '@/components/shared/Button'
import { useRouter } from 'next/navigation'
import errorHandlingToaster from '@/utilities/errorHandlingToaster'
import { GeneralInput } from '@/components/auth/GeneralInput'

interface Message {
  value: string
}

export default function Page() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const handleInputChange = (value: string) => {
    setEmail(value)
  }

  // Empty state use for error handling in the useStateHook
  const message = {
    value: '',
  }

  async function onPasswordRecoverSubmit(prevState: Message, formData: FormData): Promise<Message> {
    const formEmail = formData.get('email')
    if (
      typeof formEmail !== 'string' ||
      // Regex for valid emails
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formEmail)
    ) {
      return {
        value: 'Invalid email address',
      }
    }
    try {
      router.push('/PasswordRecoveryEmail')
      return {
        value: 'Sucess',
      }
    } catch (err) {
      const error = err as Error
      return {
        value: error.message,
      }
    }
  }

  // useActionState hook for error handling, @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  const [state, formAction] = useActionState(onPasswordRecoverSubmit, message)

  // Display a toast notification whenever state.value changes
  useEffect(() => {
    errorHandlingToaster(
      'An email has been sent to your email address with instructions on how to reset your password.',
      true,
    )
  }, [state])

  return (
    <FormLayout
      titleText={'Enter your email '}
      bodyText={'Please enter your email we will send you a request link'}
      progress_bar={false}
    >
      <form
        action={formAction}
        className="flex h-fit w-full flex-col items-center justify-start space-y-8 pt-20"
      >
        <GeneralInput
          label="Email Address"
          value={email}
          setValue={handleInputChange}
          required
          type="email"
          name="email"
          id="email"
        />
        <Button label={'Send Link'} disabled={email === ''} type="submit" />
      </form>
    </FormLayout>
  )
}
