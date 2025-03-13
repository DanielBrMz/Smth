import React from 'react'
import packageJson from 'package.json'

export default function AuthFooter() {
  // Get the version from package.json
  let version = packageJson.version
  const versionParts = version.split('.')
  versionParts.shift()
  version = versionParts.join('.')
  return (
    <>
      {/* Footer */}
      <div className="flex w-full flex-col items-center justify-center bg-transparent p-4">
        <p className="text-pretty text-[.666rem] text-sm text-white">
          * Sidepocket, an SEC-Registered Investment Advisor, has a legal obligation to prioritize
          our clients’ interests. This commitment underpins our advisory and platform services,
          ensuring integrity, transparency, and fiduciary responsibility are foundational to our
          operations.
        </p>
      </div>
    </>
  )
}
