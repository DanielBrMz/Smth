import React, { useEffect, useState } from 'react'

const DesktopMessage = () => {
  const [showMessage, setShowMessage] = useState(false)

  // Function to detect mobile devices
  const isMobileDevice = () => {
    return (
      typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
    )
  }

  useEffect(() => {
    const checkDeviceAndDisplayMessage = () => {
      // Check if it's a mobile device or screen width is less than 768 pixels
      if (isMobileDevice() || window.innerWidth < 768) {
        setShowMessage(true)
        setTimeout(() => {
          setShowMessage(false)
        }, 3000) // Hide message after 3 seconds
      } else {
        setShowMessage(false) // Ensure message is hidden on larger screens or non-mobile devices
      }
    }

    // Initialize and set up resize listener
    checkDeviceAndDisplayMessage()
    window.addEventListener('resize', checkDeviceAndDisplayMessage)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', checkDeviceAndDisplayMessage)
    }
  }, [])

  if (!showMessage) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="m-auto rounded bg-gray-500 p-2 text-center text-sm text-white">
        Please use a desktop to experience this application fully.
      </div>
    </div>
  )
}

export default DesktopMessage
