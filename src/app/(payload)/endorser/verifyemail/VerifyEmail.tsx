'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/Button'
import errorHandlingToaster from '@/utilities/errorHandlingToaster'

function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')

    if (token) {
      handleVerification(token)
    } else {
      setError('Missing verification token')
    }
  }, [])

  const handleVerification = async (token: string) => {
    try {
      setIsLoading(true)
      console.log('Sending email verification request with token')

      const response = await fetch(`/api/endorsers/verify/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Email verification response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email')
      }

      errorHandlingToaster('Email verified successfully! You can now log in.', true)
      setVerificationAttempted(true)
    } catch (err) {
      console.error('Email verification error:', err)
      setError((err as Error).message || 'Failed to verify email. Please try again.')
      setVerificationAttempted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryOrLogin = () => {
    if (error) {
      // Retry verification
      const token = new URLSearchParams(window.location.search).get('token')
      if (token) {
        handleVerification(token)
      }
    } else {
      // Proceed to login
      router.push('/endorser/login')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-xl font-bold mb-4">Verifying Your Email</h1>
        <p className="mb-4">Please wait while we verify your email address...</p>
      </div>
    )
  }

  if (!new URLSearchParams(window.location.search).get('token')) {
    return (
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-xl font-bold mb-4">Verification Error</h1>
        <p className="text-red-400 mb-4">
          Missing verification token. Please check your email link.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-xl font-bold mb-4">
          {error ? 'Email Verification Failed' : 'Email Verified Successfully!'}
        </h1>
        {verificationAttempted && (
          <p className={`mb-6 ${error ? 'text-red-400' : 'text-green-400'}`}>
            {error || 'Your email has been verified successfully.'}
          </p>
        )}
        <p className="mb-6">
          {error
            ? 'Please try verifying your email again or contact support if the problem persists.'
            : 'You can now proceed to login and access your account.'}
        </p>
        <Button
          appearance="primary"
          label={error ? 'Try Again' : 'Proceed to Login'}
          type="button"
          variant="purple"
          disabled={isLoading}
          className="w-full"
          onClick={handleRetryOrLogin}
        />
      </div>
    </div>
  )
}

export default VerifyEmail
