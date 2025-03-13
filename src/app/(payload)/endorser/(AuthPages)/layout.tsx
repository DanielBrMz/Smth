import React from 'react'
import AuthFooter from '@/components/auth/AuthFooter'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#000021] from-10% to-[#020223]">
      <AuroraBackground>
        {/* Background elements */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-signup_bg bg-contain bg-bottom bg-no-repeat opacity-30"
          style={{ backgroundPosition: 'center 100%' }}
        ></div>
        <div className="absolute inset-0 flex h-full w-full flex-col bg-gradient-to-t from-[#020223] from-10% to-transparent to-60%"></div>

        <div className="relative flex h-screen w-full flex-col items-center">
          {/* Main wrapper */}
          <div className="flex h-screen w-full items-center justify-center">
            {/* Central wrapper */}
            <div className="z-40 mx-5 flex h-full w-[31.25rem] flex-initial flex-col items-center justify-center pt-10">
              {children}
            </div>
          </div>
          {/* Footer */}
          <div className="z-40 flex h-fit w-full items-start justify-center px-16 pb-12 pt-6 md:justify-start md:pb-12">
            <div className="flex h-fit w-fit items-center justify-center">
              <AuthFooter />
            </div>
          </div>
        </div>
      </AuroraBackground>
    </main>
  )
}
