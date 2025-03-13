'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { PasswordInput } from '@/components/auth/PasswordInput'
import Link from 'next/link'
import LoadingScreen from '@/components/shared/LoadingScreen'
import image from '/public/sidepocket_logo.png'
import { GeneralInput } from '@/components/auth/GeneralInput'
import DesktopMessage from '@/components/dashboard/DekstopMessage'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit w-full flex-col items-center justify-center space-y-5 py-5"
    >
      <GeneralInput
        required
        label="Email"
        value={email}
        setValue={setEmail}
        type="email"
        name="email"
        id="email"
      />
      <PasswordInput label_text="Password" password={password} setPassword={setPassword} />
      <Button
        appearance="primary"
        label={isLoading ? 'Logging in...' : 'Login'}
        type="submit"
        variant="purple"
        disabled={isLoading}
      />
    </form>
  )
}

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Attempt login
      const loginResponse = await fetch('/api/endorsers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookie handling
      })

      const loginData = await loginResponse.json()

      if (loginResponse.ok) {
        // Verify session using /me endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const meResponse = await fetch('/api/endorsers/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const meData = await meResponse.json()
        console.log('meData:', meData)

        if (meData.user && meData.user._verified) {
          toast.success('Login successful')
          router.push('/endorser/dashboard/insights')
        } else {
          throw new Error('Session verification failed')
        }
      } else {
        // Handle specific error cases
        if (loginData.needsVerification) {
          toast.error('Please verify your email before logging in')
          // Optionally redirect to a verification reminder page
          // router.push('/Endorser/verification-required')
        } else if (loginData.error) {
          toast.error(loginData.error)
        } else {
          toast.error('Invalid credentials')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DesktopMessage />
      <Image
        src={image}
        alt="Sidepocket logo"
        width={0}
        height={0}
        sizes="100vw"
        className="mb-20 h-auto w-[23.18rem]"
        priority
      />
      <LoginForm
        onSubmit={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <Link
        href="/endorser/forgotpassword"
        className="mb-8 text-[1.0625rem] text-gray-200 hover:underline"
      >
        Forgot Password?
      </Link>
      {isLoading && <LoadingScreen />}
    </>
  )
}
