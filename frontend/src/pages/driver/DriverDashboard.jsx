import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiTruck, FiAlertCircle, FiCheckCircle, FiNavigation } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import StatCard from '../../components/ui/StatCard'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
  const { user } = useAuth()
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyService.getAll()
      .then(r => setEmergencies(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const active = emergencies.find(e => ['dispatched', 'en_route'].includes(e.status))
  const completed = emergencies.filter(e => e.status === 'resolved')

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Driver Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Trips" value={emergencies.length} icon={<FiTruck />} delay={0} />
        <StatCard title="Completed" value={completed.length} icon={<FiCheckCircle />} color="text-green-400" delay={0.1} />
        <StatCard title="Active Mission" value={active ? '1' : '0'} icon={<FiNavigation />} color="text-cyan-400" delay={0.2} />
      </div>

      {active ? (
        <div className="glass rounded-2xl p-6 border border-cyan-400/30 mb-6 glow-cyan">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold text-sm">ACTIVE MISSION</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-lg capitalize">{active.type?.replace('_', ' ')}</span>
                <SeverityBadge severity={active.severity} />
              </div>
              <div className="text-slate-400 text-sm mb-1">{active.location?.address}</div>
              <div className="text-slate-500 text-xs">Citizen: {active.citizen?.name} · {active.citizen?.phone}</div>
              {active.assignedHospital && <div className="text-green-400 text-xs mt-1">Hospital: {active.assignedHospital.name}</div>}
            </div>
            <StatusBadge status={active.status} />
          </div>
          <div className="flex gap-3 mt-4">
            <Link to="/driver/active" className="flex-1">
              <button className="w-full bg-cyan-400 text-[#030712] font-bold py-2.5 rounded-xl text-sm hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2">
                <FiNavigation /> Navigate
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center mb-6 border border-slate-700/50">
          <FiTruck className="text-slate-600 text-4xl mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No active mission</p>
          <p className="text-slate-500 text-sm mt-1">You'll be notified when dispatched.</p>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-white font-bold">Recent Trips</h3>
          <Link to="/driver/history" className="text-cyan-400 text-sm hover:text-cyan-300">View all</Link>
        </div>
        {emergencies.length === 0
          ? <div className="p-8 text-center text-slate-500">No trips yet.</div>
          : <div className="divide-y divide-slate-700/30">
            {emergencies.slice(0, 5).map(e => (
              <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/10 transition-colors">
                <div>
                  <div className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</div>
                  <div className="text-slate-500 text-xs">{e.location?.address} · {new Date(e.createdAt).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
