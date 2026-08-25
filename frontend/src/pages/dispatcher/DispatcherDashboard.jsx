import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import { ambulanceService } from '../../services/ambulanceService'
import StatCard from '../../components/ui/StatCard'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import { useSocket } from '../../context/SocketContext'
import toast from 'react-hot-toast'

export default function DispatcherDashboard() {
  const [stats, setStats] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(true)
  const socket = useSocket()

  const loadData = () => {
    Promise.all([
      emergencyService.getStats(),
      emergencyService.getAll(),
      ambulanceService.getAll()
    ]).then(([s, e, a]) => {
      setStats(s.data.data)
      setEmergencies(e.data.data)
      setAmbulances(a.data.data)
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('new_emergency', (e) => {
      setEmergencies(prev => [e, ...prev])
      toast.error(`New emergency: ${e.type}`, { icon: '🚨' })
    })
    socket.on('emergency_updated', (e) => {
      setEmergencies(prev => prev.map(x => x._id === e._id ? e : x))
    })
    return () => { socket.off('new_emergency'); socket.off('emergency_updated') }
  }, [socket])

  if (loading) return <Loader />

  const pending = emergencies.filter(e => e.status === 'pending')
  const available = ambulances.filter(a => a.status === 'available')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Dispatcher Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time emergency command center.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Emergencies" value={stats?.total || 0} icon={<FiAlertCircle />} delay={0} />
        <StatCard title="Pending" value={stats?.pending || 0} icon={<FiClock />} color="text-yellow-400" delay={0.1} />
        <StatCard title="Active" value={stats?.active || 0} icon={<FiTruck />} color="text-cyan-400" delay={0.2} />
        <StatCard title="Resolved" value={stats?.resolved || 0} icon={<FiCheckCircle />} color="text-green-400" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending emergencies */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Pending Emergencies
            </h3>
            <Link to="/dispatcher/emergencies" className="text-cyan-400 text-sm hover:text-cyan-300">View all</Link>
          </div>
          {pending.length === 0
            ? <div className="p-8 text-center text-slate-500">No pending emergencies.</div>
            : <div className="divide-y divide-slate-700/30">
              {pending.slice(0, 6).map(e => (
                <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/10 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                      <SeverityBadge severity={e.severity} />
                    </div>
                    <div className="text-slate-500 text-xs">{e.location?.address || 'Location recorded'}</div>
                    <div className="text-slate-500 text-xs">{e.citizen?.name} · {e.citizen?.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} />
                    <Link to="/dispatcher/emergencies"
                      className="text-xs px-3 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors">
                      Dispatch
                    </Link>
                  </div>
                </div>
              ))}
            </div>}
        </div>

        {/* Fleet status */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-white font-bold">Fleet Status</h3>
            <Link to="/dispatcher/ambulances" className="text-cyan-400 text-sm hover:text-cyan-300">Manage</Link>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-green-400">{available.length}</div>
                <div className="text-xs text-slate-500">Available</div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-cyan-400">{ambulances.length - available.length}</div>
                <div className="text-xs text-slate-500">Deployed</div>
              </div>
            </div>
            {ambulances.slice(0, 5).map(a => (
              <div key={a._id} className="flex items-center justify-between glass-light rounded-xl px-3 py-2">
                <div>
                  <div className="text-white text-sm font-semibold">{a.vehicleNumber}</div>
                  <div className="text-slate-500 text-xs">{a.driver?.name || 'No driver'}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
