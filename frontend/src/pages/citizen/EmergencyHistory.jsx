import { useState, useEffect } from 'react'
import { emergencyService } from '../../services/emergencyService'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function EmergencyHistory() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyService.getAll()
      .then(r => setEmergencies(r.data.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Emergency History</h1>
        <p className="text-slate-400 text-sm mt-1">All your past emergency requests.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? <Loader /> : emergencies.length === 0
          ? <div className="p-12 text-center text-slate-500">No emergency history found.</div>
          : <div className="divide-y divide-slate-700/30">
            {emergencies.map(e => (
              <div key={e._id} className="px-6 py-4 hover:bg-slate-700/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                      <SeverityBadge severity={e.severity} />
                    </div>
                    <div className="text-slate-400 text-xs">{e.location?.address || 'Location recorded'}</div>
                    {e.assignedAmbulance && <div className="text-slate-500 text-xs mt-1">Unit: {e.assignedAmbulance.vehicleNumber}</div>}
                    {e.assignedHospital && <div className="text-slate-500 text-xs">Hospital: {e.assignedHospital.name}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={e.status} />
                    <span className="text-slate-500 text-xs">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
