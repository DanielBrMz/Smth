import React from 'react'
import AuthFooter from '@/components/auth/AuthFooter'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#000021] from-10% to-[#020223]">
      {/* Content wrapper */}
      <div className="flex flex-1 flex-col justify-center">
        {/* AuroraBackground wraps only the children */}
        <AuroraBackground className="flex flex-1 flex-col">
          {/* Background elements */}
          <div
            className="absolute inset-0 w-full bg-signup_bg bg-contain bg-bottom bg-no-repeat"
            style={{ backgroundPosition: 'center 100%' }}
          ></div>
          <div className="absolute inset-0 w-full bg-gradient-to-t from-[#020223] from-10% to-transparent to-60%"></div>

          {/* Content area */}
          <div className="relative flex flex-1 items-center justify-center">
            {/* Central wrapper */}
            <div className="z-40 mx-5 w-full max-w-[31.25rem] flex flex-col items-center">
              {children}
            </div>
          </div>
        </AuroraBackground>
      </div>

      {/* Footer outside the AuroraBackground */}
      <div className="z-40 flex w-full items-start justify-center px-16 pb-12 pt-6 md:justify-start md:pb-12">
        <AuthFooter />
      </div>
    </main>
  )
}
