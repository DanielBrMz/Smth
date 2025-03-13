'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SideNavigation from '@/components/dashboard/SideNavigation'
import NotificationButton from '@/components/dashboard/NotificationButton'
import ProfileButton from '@/components/dashboard/ProfileButton'
import { Info } from 'lucide-react'
import { LogoUpload } from '@/components/dashboard/LogoUpload'
import { Button } from '@/components/shared/Button'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { toast } from 'react-hot-toast'

type User = {
  id: string
  username?: string
  email: string
  name?: string
  verified: boolean
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [branchUrl, setBranchUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/endorsers/me', {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()

        // Double-check verification status
        if (!userData.user._verified) {
          toast.error('Please verify your email to access the dashboard')
          router.push('/endorser/login')
          return
        }

        setUser({
          id: userData.user.id,
          username: userData.user.username,
          email: userData.user.email,
          name: userData.user.name,
          verified: userData.user._verified,
        })

        // Set branch URL using username if available, fallback to ID
        setBranchUrl(
          `https://sidepocket.app/endorser/${userData.user.username || userData.user.id}`,
        )
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleShareBranch = async () => {
    const shareUrl = `${branchUrl}/signup`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Branch URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy URL')
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/endorsers/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Logged out successfully')
        router.push('/Endorser/Login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex w-full h-screen overflow-hidden bg-[#000021]">
      {/* Sidebar */}
      <nav className="hidden h-full min-w-[19rem] flex-col items-center justify-between pt-12 pl-4 xl:flex w-1/6">
        <div className="flex h-fit w-fit flex-col">
          <LogoUpload brandId={user.id} />
          <div className="mt-[4.375rem] flex h-fit w-fit">
            <SideNavigation
              path={'/endorser/dashboard'}
              items={[
                { text: 'Insights', slug: 'insights' },
                { text: 'Media Library', slug: 'media' },
                { text: 'Audience', slug: 'audience' },
                { text: 'Settings', slug: 'settings' },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center pb-8 pt-16 px-4 py-4 w-full justify-between">
          {/* Left-aligned components */}
          <div className="pl-2 flex items-center gap-4">
            <div className="flex rounded-xl bg-[#11142f] items-center p-2 gap-4">
              <div className="flex rounded-xl bg-gray-800 py-2 px-2">
                <span className="text-white">{`${branchUrl}/signup`}</span>
              </div>
              <Button
                appearance="primary"
                onClick={handleShareBranch}
                label="Share Branch"
                className="w-full max-w-[10rem] text-sm text-nowrap px-2 h-9 rounded-sm"
              />
            </div>
            <div className="flex rounded-xl h-9">
              <Button
                appearance="primary"
                el="link"
                href={`${branchUrl}/login`}
                label="Go to My Branch"
                className="w-full max-w-[10rem] h-full text-sm text-nowrap rounded-sm"
                newTab
              />
            </div>
          </div>

          {/* Right-aligned components */}
          <div className="flex items-center space-x-4 pr-2">
            <NotificationButton />
            <Link
              href={'/support'}
              className="fully_animated scaled_hover flex items-center space-x-2 rounded-[0.5rem] bg-soft_purple bg-opacity-20 px-5 py-1 outline outline-2 outline-soft_purple"
              target="_blank"
            >
              <span className="text-sm text-white">Support</span>
              <Info className="h-5 w-5 stroke-white" />
            </Link>
            <ProfileButton email={user.email} name={user.name || ''} onLogout={handleLogout} />
          </div>
        </div>

        {/* Dashboard Content */}
        <div
          id="scrollable-parent"
          className="flex-1 overflow-y-auto h-full overscroll-contain no-scrollbar rounded-lg w-full px-4"
        >
          <div className="w-full px-4 rounded-lg">{children}</div>
        </div>
      </div>
    </main>
  )
}
