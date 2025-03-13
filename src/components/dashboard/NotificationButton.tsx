import { BellIcon, MoreHorizontal, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { BellIcon as SolidBell } from '@heroicons/react/24/outline'

import BlurredBackground from '@/components/shared/BlurredBackground'

type Notification = {
  id: string
  service: string
  active: boolean
  actionScreen: string
  actionName: string
  actionParams: string
  title: string
  details: string
  notificationType: string
  notificationPriority: string
  eventId: string
  lastUpdated: string
  read?: boolean
}

function NotificationButton() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([] as Notification[])
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Mock data for notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      service: 'Service A',
      active: true,
      actionScreen: 'Screen A',
      actionName: 'Action A',
      actionParams: '{}',
      title: 'New Feature Available!',
      details: 'Check out this new feature in Service A.',
      notificationType: 'info',
      notificationPriority: 'high',
      eventId: 'event1',
      lastUpdated: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      service: 'Service B',
      active: true,
      actionScreen: 'Screen B',
      actionName: 'Action B',
      actionParams: '{}',
      title: 'Scheduled Maintenance',
      details: 'Service B will undergo maintenance tonight.',
      notificationType: 'warning',
      notificationPriority: 'medium',
      eventId: 'event2',
      lastUpdated: new Date().toISOString(),
      read: false,
    },
    // Add more mock notifications if needed
  ]

  // Use mock data instead of fetching from API
  useEffect(() => {
    setNotifications(mockNotifications)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const count = notifications.reduce((accumulator, notification) => {
      return !notification.read ? accumulator + 1 : accumulator
    }, 0)
    setUnreadCount(count)
  }, [notifications])

  const toggleModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    setShowModal((currentShowModal) => {
      if (!currentShowModal) {
        // Mark all notifications as read
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          read: true, // Only update the read status
        }))
        setNotifications(updatedNotifications) // Update notifications with read status

        // Reset unread notifications count to 0
        setUnreadCount(0)
      }
      // Toggle the visibility of the modal
      return !currentShowModal
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false)
      }
    }

    if (showModal) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showModal])

  return (
    <div className="relative hidden sm:block">
      <button
        className="relative ml-[2rem] flex h-12 w-12 items-center justify-center rounded-full outline-1 outline-white border-solid border-1 border-[#000021] bg-[#000021] hover:bg-gray-400"
        onClick={(e) => toggleModal(e)} // Toggles the modal
      >
        {showModal ? (
          <SolidBell className="h-6 w-6 text-white" />
        ) : (
          <BellIcon className="h-6 w-6 stroke-white" />
        )}
        {/* Display unread notifications count */}
        {unreadCount > 0 && !showModal && (
          <span className="absolute right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <BlurredBackground active={showModal} />
      {showModal && (
        <div
          ref={modalRef}
          className="absolute right-0 top-16 z-50 mt-2 flex h-[34rem] w-[32rem] flex-col justify-start overflow-y-scroll rounded-[0.8rem] border-1 border-white bg-[#121526] p-8 font-semibold text-white shadow-lg"
          style={{
            boxShadow: '0px 0px 20px #000',
          }}
        >
          <div className="flex justify-between p-4">
            <span className="text-xl font-bold">Notifications</span>
            <button onClick={() => setShowModal(false)}>
              <MoreHorizontal className="h-10 w-10 text-slate-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="flex flex-col space-y-4 overflow-auto p-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const notificationDateTime = new Date(notification.lastUpdated)
                const notificationDate = notificationDateTime.toISOString().split('T')[0]
                const notificationTime = notificationDateTime
                  .toISOString()
                  .split('T')[1]!
                  .slice(0, 8)

                return (
                  <div
                    key={notification.id}
                    className="relative flex flex-col rounded-[0.8rem] bg-[#292c3b] p-4 text-left text-white hover:bg-gray-700"
                  >
                    <XIcon
                      className="absolute right-2 top-2 h-4 w-4 cursor-pointer"
                      onClick={() => {
                        // Just mock removing the notification for now
                        setNotifications((prevNotifications) =>
                          prevNotifications.filter((n) => n.id !== notification.id),
                        )
                      }}
                    />
                    <div className="my-2 flex justify-between text-xs font-light">
                      <span>{notificationDate}</span>
                      <span className="text-right">{notificationTime}</span>
                    </div>
                    <span className="text-[1.1rem] font-bold">{notification.title}</span>
                    <span className="text-[1.1rem] font-light leading-6">
                      {notification.details}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-white">No notifications to display.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationButton
