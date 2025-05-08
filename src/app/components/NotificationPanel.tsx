'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { notificationService, Notification } from '@/utils/notificationService'

export default function NotificationPanel() {
  const { address, isConnected } = useAccount()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      const userNotifications = notificationService.getNotifications(address)
      setNotifications(userNotifications)
      updateUnreadCount(userNotifications)
      
      const timer = setTimeout(() => {
        notificationService.simulateRandomNotifications(address)
      }, 5000)
      
      const unsubscribe = notificationService.onNewNotification(address, (notification) => {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      
      return () => {
        clearTimeout(timer)
        unsubscribe()
      }
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [address, isConnected])
  
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(notification => !notification.read).length
    setUnreadCount(count)
  }

  const handleMarkAsRead = (id: string) => {
    if (address) {
      notificationService.markAsRead(address, id)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = () => {
    if (address) {
      notificationService.markAllAsRead(address)
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) return 'Ahora mismo'
    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffHour < 24) return `Hace ${diffHour} h`
    if (diffDay < 7) return `Hace ${diffDay} días`
    return date.toLocaleDateString()
  }

  if (!mounted) {
    return (
      <div className="relative">
        <button className="relative p-2 text-gray-600 hover:text-black focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-black focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-black">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-black">{notification.title}</span>
                    <span className="text-xs text-gray-500">{formatRelativeTime(notification.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  
                  <div className="mt-2 flex justify-end gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Marcar como leída
                      </button>
                    )}
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setShowPanel(false)
                          handleMarkAsRead(notification.id)
                        }}
                      >
                        Ver detalles
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 