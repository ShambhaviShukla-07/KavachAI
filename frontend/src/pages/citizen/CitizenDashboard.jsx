import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiClock, FiCheckCircle, FiShield } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import StatCard from '../../components/ui/StatCard'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyService.getAll()
      .then(r => setEmergencies(r.data.data))
      .catch(() => toast.error('Failed to load emergencies'))
      .finally(() => setLoading(false))
  }, [])

  const active = emergencies.filter(e => !['resolved', 'cancelled'].includes(e.status))
  const resolved = emergencies.filter(e => e.status === 'resolved')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Welcome, {user?.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Your emergency dashboard — stay safe.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Requests" value={emergencies.length} icon={<FiAlertCircle />} delay={0} />
        <StatCard title="Active" value={active.length} icon={<FiClock />} color="text-yellow-400" delay={0.1} />
        <StatCard title="Resolved" value={resolved.length} icon={<FiCheckCircle />} color="text-green-400" delay={0.2} />
        <StatCard title="Safety Score" value="98%" icon={<FiShield />} color="text-cyan-400" delay={0.3} />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-400 text-xl" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Request Emergency Help</h3>
          <p className="text-slate-400 text-sm mb-4">Trigger an emergency request and get help dispatched immediately.</p>
          <Link to="/citizen/request"><Button variant="danger" size="sm">Request Now</Button></Link>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
            <FiShield className="text-pink-400 text-xl" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Women Safety SOS</h3>
          <p className="text-slate-400 text-sm mb-4">Trigger a silent SOS alert with your live location instantly.</p>
          <Link to="/citizen/women-safety"><Button variant="danger" size="sm" className="bg-pink-500/20 border-pink-500/40 text-pink-400">SOS Alert</Button></Link>
        </motion.div>
      </div>

      {/* Recent emergencies */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-white font-bold">Recent Emergencies</h3>
          <Link to="/citizen/history" className="text-cyan-400 text-sm hover:text-cyan-300">View all</Link>
        </div>
        {loading ? <Loader /> : emergencies.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No emergencies yet. Stay safe!</div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {emergencies.slice(0, 5).map(e => (
              <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/10 transition-colors">
                <div>
                  <div className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{e.location?.address || 'Location recorded'} · {new Date(e.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={e.severity} />
                  <StatusBadge status={e.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
