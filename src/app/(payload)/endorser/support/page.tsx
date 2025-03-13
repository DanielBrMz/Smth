'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { GeneralInput } from '@/components/auth/GeneralInput'
import DesktopMessage from '@/components/dashboard/DekstopMessage'

import { LargeInput } from '@/components/auth/LargeInput'
import { useRouter } from 'next/navigation'

type ContactFormProps = {
  formAction: (payload: FormData) => void
  account: string
  setAccount: React.Dispatch<React.SetStateAction<string>>
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  subject: string
  setSubject: React.Dispatch<React.SetStateAction<string>>
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

const ContactForm: React.FC<ContactFormProps> = ({
  formAction,
  account,
  setAccount,
  email,
  setEmail,
  subject,
  setSubject,
  message,
  setMessage,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('account', account)
    formData.append('email', email)
    formData.append('subject', subject)
    formData.append('message', message)
    formAction(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[30.18rem] flex-col items-center justify-center space-y-5"
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
      <GeneralInput
        required
        label="Subject"
        value={subject}
        setValue={setSubject}
        type="text"
        name="subject"
        id="subject"
      />
      <LargeInput
        required
        label="Message"
        value={message}
        setValue={setMessage}
        name="message"
        id="message"
        // Adjust height for the larger textarea
      />
      <Button label="Send Message" type="submit" />
    </form>
  )
}

export default function Page() {
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const formAction = (formData: FormData) => {
    void (async () => {
      try {
        router.push('/Dashboard/insights')
      } catch (error) {
        console.error('Error uploading document:', error)
      }
    })()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10 text-white">
      <DesktopMessage />
      <h1 className="mb-20 text-3xl font-bold">Contact Support</h1>
      <ContactForm
        formAction={formAction}
        account={account}
        setAccount={setAccount}
        email={email}
        setEmail={setEmail}
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
      />
      <Link href="/Dashboard" className="mt-6 text-[.9375rem] text-gray-200 hover:underline">
        {'Return to Home'}
      </Link>
    </div>
  )
}
