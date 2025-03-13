'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Message } from '@/components/auth/Message'

type UsernameFormData = {
  username: string
}

type PasswordFormData = {
  password: string
  passwordConfirm: string
}

type User = {
  id: number
  name: string
  lastName: string
  phoneNumber: string
  profilePicture: null
  username: string
  role: 'endorser' | 'reviewer' | 'admin'
  referralCode: string
  totpSecret: string
  verificationToken: string
  isVerified: boolean
  verificationTokenExpiry: string | null
  updatedAt: string
  createdAt: string
  email: string
  loginAttempts: number
}

type MeResponse = {
  user: User
  collection: string
  strategy: string
  exp: number
  token: string
  message: string
}

const AccountForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<MeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const {
    formState: { errors: usernameErrors },
    handleSubmit: handleUsernameSubmit,
    register: registerUsername,
    reset: resetUsername,
  } = useForm<UsernameFormData>({
    defaultValues: {
      username: userData?.user.username || '',
    },
  })

  const {
    formState: { errors: passwordErrors },
    handleSubmit: handlePasswordSubmit,
    register: registerPassword,
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>()

  const password = useRef({})
  password.current = watch('password', '')

  // Check authentication and fetch user data on mount
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        setIsAuthenticated(true)

        // Fetch user data
        const response = await fetch(`/api/endorsers/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          resetUsername({ username: data.user.username || '' })
        } else {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.error('Error during authentication check:', err)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchUser()
  }, [resetUsername])

  const onSubmitUsername = useCallback(
    async (data: UsernameFormData) => {
      if (userData?.user) {
        setError('Not authenticated or user data missing')
        return
      }

      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/update-username`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: data.username,
              userId: userData!.user.id,
            }),
          },
        )

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || 'Failed to update username')
          return
        }

        setUserData(result)
        setSuccess('Username updated successfully!')
        resetUsername({ username: result.user.username })
      } catch (err) {
        console.error('Error updating username:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    [userData, resetUsername],
  )

  const onSubmitPassword = useCallback(
    async (data: PasswordFormData) => {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        // First get the reset token
        const tokenResponse = await fetch('/api/users/request-password-reset', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData!.user.email,
          }),
        })

        const tokenResult = await tokenResponse.json()

        if (!tokenResponse.ok) {
          setError(tokenResult.errors?.[0]?.message || 'Failed to initiate password reset')
          return
        }

        // Then use Payload's reset-password endpoint
        const resetResponse = await fetch('/api/users/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenResult.token, // Use the token from forgot-password
            password: data.password,
          }),
        })

        const resetResult = await resetResponse.json()

        if (!resetResponse.ok) {
          setError(resetResult.errors?.[0]?.message || 'Failed to reset password')
          return
        }

        setSuccess('Password updated successfully!')
        resetPassword({
          password: '',
          passwordConfirm: '',
        })
      } catch (err) {
        console.error('Error updating password:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    [userData, resetPassword],
  )

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <span>Loading...</span>
      </div>
    )
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center p-4">
        <Message error="Please log in to access this page" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 mb-6 w-1/5 md:w-full">
      <span className="text-[1.3rem] font-bold text-white p-2 block mb-2">
        Set Account Username
      </span>
      <form
        className="flex flex-col gap-6 mb-6 w-full justify-start items-start"
        onSubmit={handleUsernameSubmit(onSubmitUsername)}
      >
        <Message className="mb-6" error={error} success={success} />
        <Input
          error={usernameErrors.username}
          label="Username"
          name="username"
          register={registerUsername}
          required
          type="text"
          validate={(value: string) => {
            if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
              return 'Username can only contain letters, numbers, underscores and hyphens'
            }
            if (value.length < 3) {
              return 'Username must be at least 3 characters long'
            }
            return true
          }}
        />
        <Button
          variant="purple"
          className="mt-4"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          label={isSubmitting ? 'Processing' : 'Update Username'}
        />
      </form>

      <span className="text-[1.3rem] font-bold text-white p-2 block mb-2">Change Password</span>
      <form
        className="flex flex-col gap-6 mb-6 w-full justify-start items-start"
        onSubmit={handlePasswordSubmit(onSubmitPassword)}
      >
        <Input
          error={passwordErrors.password}
          label="New Password"
          name="password"
          register={registerPassword}
          required
          type="password"
          validate={(value: string) => {
            if (value.length < 8) {
              return 'Password must be at least 8 characters long'
            }
            return true
          }}
        />
        <Input
          error={passwordErrors.passwordConfirm}
          label="Confirm New Password"
          name="passwordConfirm"
          register={registerPassword}
          required
          type="password"
          validate={(value: string) => {
            if (value !== password.current) {
              return 'The passwords do not match'
            }
            return true
          }}
        />
        <Button
          variant="purple"
          className="mt-4"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          label={isSubmitting ? 'Processing' : 'Change Password'}
        />
      </form>
    </div>
  )
}

export default AccountForm
