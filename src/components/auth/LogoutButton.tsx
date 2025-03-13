import React, { useState } from 'react'
import { LoadingWheel } from '@/components/shared/LoadingScreen'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setPending(true)

    try {
      await router.push('/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="flex items-center justify-center" onSubmit={handleLogout}>
      <button
        type="submit"
        className="mx-auto w-full rounded-[0.8rem] border-2 border-white bg-[#292c3b] py-4 text-lg hover:bg-gray-400"
        disabled={pending}
      >
        {pending ? <LoadingWheel size="6" /> : 'Logout'}
      </button>
    </form>
  )
}
