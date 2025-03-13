'use client'
import React from 'react'
import SideSubNavigation from '@/components/dashboard/SideSubNavigation'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-full flex-col rounded-xl bg-[#11142f] sm:flex-row">
      {/* Top bar - visible on small screens, hidden on md screens and larger */}
      <nav className="sticky top-0 flex h-16 w-full items-center justify-start overflow-x-auto bg-[#000021] sm:hidden">
        <div className="flex h-full items-center space-x-4 px-4">
          <SideSubNavigation path={'/dashboard/settings'} items={[{ text: 'Change Password' }]} />
        </div>
      </nav>

      {/* Sidebar - hidden on small screens, visible on md screens and larger */}
      <nav className="sticky hidden h-full w-[15rem] flex-col items-start justify-start space-y-8 sm:flex md:w-[12rem]">
        {/* Nav wrapper */}
        <div className="flex h-fit w-full flex-col">
          {/* Side nav buttons */}
          <div className="my-4 flex w-full flex-col space-y-2">
            <SideSubNavigation path={'/dashboard/settings'} items={[{ text: 'Account Info' }]} />
          </div>
        </div>
        {/* Logout button */}
      </nav>

      {/* Dashboard content */}
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto p-8 scrollbar-hide">{children}</div>
      </div>
    </main>
  )
}
