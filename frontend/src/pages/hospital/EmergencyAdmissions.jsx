import { useState, useEffect } from 'react'
import { emergencyService } from '../../services/emergencyService'
import { hospitalService } from '../../services/hospitalService'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function EmergencyAdmissions() {
  const [emergencies, setEmergencies] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingBeds, setUpdatingBeds] = useState({})

  useEffect(() => {
    Promise.all([emergencyService.getAll(), hospitalService.getAll()])
      .then(([e, h]) => { setEmergencies(e.data.data); setHospitals(h.data.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const updateBeds = async (hospitalId, delta) => {
    const hospital = hospitals.find(h => h._id === hospitalId)
    if (!hospital) return
    const newBeds = Math.max(0, Math.min(hospital.totalBeds, hospital.availableBeds + delta))
    setUpdatingBeds(prev => ({ ...prev, [hospitalId]: true }))
    try {
      await hospitalService.updateBeds(hospitalId, newBeds)
      setHospitals(prev => prev.map(h => h._id === hospitalId ? { ...h, availableBeds: newBeds } : h))
      toast.success('Bed count updated')
    } catch { toast.error('Update failed') }
    finally { setUpdatingBeds(prev => ({ ...prev, [hospitalId]: false })) }
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Emergency Admissions</h1>
        <p className="text-slate-400 text-sm mt-1">Manage incoming patients and bed availability.</p>
      </div>

      {/* Bed management */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {hospitals.map(h => (
          <div key={h._id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-bold">{h.name}</div>
                <div className="text-slate-500 text-xs">{h.address}</div>
              </div>
              <span className={`text-sm font-black ${h.availableBeds > 5 ? 'text-green-400' : h.availableBeds > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                {h.availableBeds}/{h.totalBeds}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all"
                style={{ width: `${(h.availableBeds / h.totalBeds) * 100}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm flex-1">Available Beds</span>
              <button onClick={() => updateBeds(h._id, -1)} disabled={updatingBeds[h._id] || h.availableBeds === 0}
                className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-40 font-bold transition-colors">−</button>
              <span className="text-white font-bold w-8 text-center">{h.availableBeds}</span>
              <button onClick={() => updateBeds(h._id, 1)} disabled={updatingBeds[h._id] || h.availableBeds === h.totalBeds}
                className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-40 font-bold transition-colors">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* All emergencies assigned to hospital */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-bold">All Emergency Cases</h3>
        </div>
        {emergencies.length === 0
          ? <div className="p-8 text-center text-slate-500">No cases found.</div>
          : <div className="divide-y divide-slate-700/30">
            {emergencies.map(e => (
              <div key={e._id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-700/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                    <SeverityBadge severity={e.severity} />
                  </div>
                  <div className="text-slate-400 text-xs">{e.citizen?.name} · {e.citizen?.phone}</div>
                  <div className="text-slate-500 text-xs">{e.location?.address}</div>
                  <div className="text-slate-600 text-xs">{new Date(e.createdAt).toLocaleString()}</div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
