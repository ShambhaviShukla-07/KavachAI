import { useState, useEffect } from 'react'
import { emergencyService } from '../../services/emergencyService'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function TripHistory() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyService.getAll()
      .then(r => setTrips(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Trip History</h1>
        <p className="text-slate-400 text-sm mt-1">{trips.length} total trips</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? <Loader /> : trips.length === 0
          ? <div className="p-12 text-center text-slate-500">No trips yet.</div>
          : <div className="divide-y divide-slate-700/30">
            {trips.map(t => (
              <div key={t._id} className="px-6 py-4 hover:bg-slate-700/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm capitalize">{t.type?.replace('_', ' ')}</span>
                      <SeverityBadge severity={t.severity} />
                    </div>
                    <div className="text-slate-400 text-xs">{t.location?.address}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{t.citizen?.name}</div>
                    {t.assignedHospital && <div className="text-slate-500 text-xs">→ {t.assignedHospital.name}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={t.status} />
                    <span className="text-slate-500 text-xs">{new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
