import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
FiAlertCircle,
FiClock,
FiCheckCircle,
FiShield,
FiBell,
FiCheck
} from 'react-icons/fi'
import { io } from 'socket.io-client'
import { emergencyService } from '../../services/emergencyService'
import api from '../../services/api'
import StatCard from '../../components/ui/StatCard'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const SOCKET_URL =
import.meta.env.VITE_SOCKET_URL ||
(import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin)

export default function CitizenDashboard() {
const { user } = useAuth()

const [emergencies, setEmergencies] = useState([])
const [loading, setLoading] = useState(true)
const [notifications, setNotifications] = useState([])
const [showNotifications, setShowNotifications] = useState(false)
const [notificationsLoading, setNotificationsLoading] = useState(false)

const unreadCount = notifications.filter(notification => !notification.read).length

useEffect(() => {
let cancelled = false


emergencyService.getAll()
  .then(response => {
    if (!cancelled) {
      setEmergencies(response.data.data || [])
    }
  })
  .catch(() => {
    if (!cancelled) toast.error('Failed to load emergencies')
  })
  .finally(() => {
    if (!cancelled) setLoading(false)
  })

return () => {
  cancelled = true
}


}, [])

useEffect(() => {
if (!user?._id) return


let active = true

const loadNotifications = async () => {
  setNotificationsLoading(true)

  try {
    const response = await api.get('/notifications')
    if (active) {
      setNotifications(response.data.data || [])
    }
  } catch {
    if (active) toast.error('Failed to load notifications')
  } finally {
    if (active) setNotificationsLoading(false)
  }
}

loadNotifications()

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
})

socket.on('connect', () => {
  socket.emit('join_user_room', String(user._id))
})

socket.on('new_notification', (notification) => {
  if (!active || !notification) return

  setNotifications(previous => {
    if (previous.some(item => item._id === notification._id)) {
      return previous
    }

    return [notification, ...previous].slice(0, 20)
  })

  toast.success(notification.title || 'New notification')
})

socket.on('emergency_updated', (updatedEmergency) => {
  if (!active || !updatedEmergency?._id) return

  setEmergencies(previous => {
    const exists = previous.some(item => item._id === updatedEmergency._id)

    if (!exists) return previous

    return previous.map(item =>
      item._id === updatedEmergency._id
        ? { ...item, ...updatedEmergency }
        : item
    )
  })
})

return () => {
  active = false
  socket.disconnect()
}


}, [user?._id])

const markNotificationsRead = async () => {
  try {
    await api.put('/notifications/read')

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    )

    toast.success('All notifications marked as read')
  } catch (error) {
    console.error(
      'Mark notifications read error:',
      error.response?.data || error.message
    )

    toast.error('Could not mark notifications as read')
  }
}

const handleNotificationClick = async () => {
setShowNotifications(previous => !previous)


if (unreadCount > 0) {
  await markNotificationsRead()
}


}

const active = emergencies.filter(
emergency => !['resolved', 'cancelled'].includes(emergency.status)
)

const resolved = emergencies.filter(
emergency => emergency.status === 'resolved'
)

return ( <div> <div className="mb-6 flex items-start justify-between gap-4"> <div> <h1 className="text-2xl font-black text-white">
Welcome, {user?.name} 👋 </h1> <p className="text-slate-400 text-sm mt-1">
Your emergency dashboard — stay safe. </p> </div>


    <div className="relative">
      <button
        type="button"
        onClick={handleNotificationClick}
        className="relative rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-white hover:bg-slate-700 transition-colors"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={showNotifications}
      >
        <FiBell className="text-xl" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-14 z-50 w-80 max-w-[90vw] glass rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <h3 className="text-white font-bold">Notifications</h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markNotificationsRead}
                className="text-cyan-400 text-xs hover:text-cyan-300"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notificationsLoading ? (
              <div className="p-5 text-center text-slate-400 text-sm">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-5 text-center text-slate-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-slate-700/40 ${
                    notification.read ? '' : 'bg-cyan-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FiBell className="text-cyan-400 mt-1 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold">
                        {notification.title}
                      </p>

                      <p className="text-slate-400 text-xs mt-1 break-words">
                        {notification.message}
                      </p>

                      <p className="text-slate-500 text-xs mt-2">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : ''}
                      </p>

                      {notification.link && (
                        <Link
                          to={notification.link}
                          onClick={() => setShowNotifications(false)}
                          className="inline-block text-cyan-400 text-xs mt-2 hover:text-cyan-300"
                        >
                          View details
                        </Link>
                      )}
                    </div>

                    {!notification.read && (
                      <FiCheck className="text-cyan-400 shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <StatCard
      title="Total Requests"
      value={emergencies.length}
      icon={<FiAlertCircle />}
      delay={0}
    />
    <StatCard
      title="Active"
      value={active.length}
      icon={<FiClock />}
      color="text-yellow-400"
      delay={0.1}
    />
    <StatCard
      title="Resolved"
      value={resolved.length}
      icon={<FiCheckCircle />}
      color="text-green-400"
      delay={0.2}
    />
    <StatCard
      title="Safety Score"
      value="98%"
      icon={<FiShield />}
      color="text-cyan-400"
      delay={0.3}
    />
  </div>

  <div className="grid sm:grid-cols-2 gap-4 mb-8">
    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
        <FiAlertCircle className="text-red-400 text-xl" />
      </div>

      <h3 className="text-white font-bold text-lg mb-1">
        Request Emergency Help
      </h3>

      <p className="text-slate-400 text-sm mb-4">
        Trigger an emergency request and get help dispatched immediately.
      </p>

      <Link to="/citizen/request">
        <Button variant="danger" size="sm">Request Now</Button>
      </Link>
    </motion.div>

    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
        <FiShield className="text-pink-400 text-xl" />
      </div>

      <h3 className="text-white font-bold text-lg mb-1">
        Women Safety SOS
      </h3>

      <p className="text-slate-400 text-sm mb-4">
        Trigger a silent SOS alert with your live location instantly.
      </p>

      <Link to="/citizen/women-safety">
        <Button
          variant="danger"
          size="sm"
          className="bg-pink-500/20 border-pink-500/40 text-pink-400"
        >
          SOS Alert
        </Button>
      </Link>
    </motion.div>
  </div>

  <div className="glass rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
      <h3 className="text-white font-bold">Recent Emergencies</h3>

      <Link
        to="/citizen/history"
        className="text-cyan-400 text-sm hover:text-cyan-300"
      >
        View all
      </Link>
    </div>

    {loading ? (
      <Loader />
    ) : emergencies.length === 0 ? (
      <div className="p-8 text-center text-slate-500">
        No emergencies yet. Stay safe!
      </div>
    ) : (
      <div className="divide-y divide-slate-700/30">
        {emergencies.slice(0, 5).map(emergency => (
          <div
            key={emergency._id}
            className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-700/10 transition-colors"
          >
            <div>
              <div className="text-white font-semibold text-sm capitalize">
                {emergency.type?.replace('_', ' ')}
              </div>

              <div className="text-slate-500 text-xs mt-0.5">
                {emergency.location?.address || 'Location recorded'}
                {' · '}
                {new Date(emergency.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SeverityBadge severity={emergency.severity} />
              <StatusBadge status={emergency.status} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>


)
}
