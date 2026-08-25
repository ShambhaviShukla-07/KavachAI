import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { MdLocalHospital } from 'react-icons/md'
import { hospitalService } from '../../services/hospitalService'
import { emergencyService } from '../../services/emergencyService'
import StatCard from '../../components/ui/StatCard'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function HospitalDashboard() {
  const { user } = useAuth()
  const [hospitals, setHospitals] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([hospitalService.getAll(), emergencyService.getAll()])
      .then(([h, e]) => { setHospitals(h.data.data); setEmergencies(e.data.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const incoming = emergencies.filter(e => ['dispatched', 'en_route'].includes(e.status))
  const totalBeds = hospitals.reduce((s, h) => s + h.totalBeds, 0)
  const availBeds = hospitals.reduce((s, h) => s + h.availableBeds, 0)

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Hospital Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage admissions and bed availability.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Beds" value={totalBeds} icon={<FiUsers />} delay={0} />
        <StatCard title="Available Beds" value={availBeds} icon={<FiHeart />} color="text-green-400" delay={0.1} />
        <StatCard title="Incoming" value={incoming.length} icon={<FiAlertCircle />} color="text-yellow-400" delay={0.2} />
        <StatCard title="Hospitals" value={hospitals.length} icon={<MdLocalHospital />} color="text-cyan-400" delay={0.3} />
      </div>

      {/* Hospital cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {hospitals.map(h => (
          <div key={h._id} className="glass rounded-2xl p-5 hover:border-cyan-400/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                <MdLocalHospital className="text-green-400 text-xl" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{h.name}</div>
                <div className="text-slate-500 text-xs">{h.address}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Available Beds</span>
                <span className={`font-bold ${h.availableBeds > 5 ? 'text-green-400' : h.availableBeds > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {h.availableBeds}/{h.totalBeds}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${(h.availableBeds / h.totalBeds) * 100}%` }} />
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${h.availableBeds > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {h.availableBeds > 0 ? 'Accepting Patients' : 'Full'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Incoming emergencies */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> Incoming Patients
          </h3>
          <Link to="/hospital/admissions" className="text-cyan-400 text-sm hover:text-cyan-300">View all</Link>
        </div>
        {incoming.length === 0
          ? <div className="p-8 text-center text-slate-500">No incoming patients.</div>
          : <div className="divide-y divide-slate-700/30">
            {incoming.map(e => (
              <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                    <SeverityBadge severity={e.severity} />
                  </div>
                  <div className="text-slate-500 text-xs">{e.citizen?.name} · {e.citizen?.phone}</div>
                  {e.assignedAmbulance && <div className="text-cyan-400 text-xs">Unit: {e.assignedAmbulance.vehicleNumber}</div>}
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
