import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiNavigation, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import { SeverityBadge, StatusBadge } from '../../components/ui/SeverityBadge'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function ActiveEmergency() {
  const [emergency, setEmergency] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    emergencyService.getAll()
      .then(r => {
        const active = r.data.data.find(e => ['dispatched', 'en_route', 'arrived'].includes(e.status))
        setEmergency(active || null)
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (status) => {
    if (!emergency) return
    setUpdating(true)
    try {
      await emergencyService.updateStatus(emergency._id, status)
      setEmergency(prev => ({ ...prev, status }))
      toast.success(`Status updated to ${status}`)
      if (status === 'resolved') navigate('/driver/dashboard')
    } catch { toast.error('Update failed') }
    finally { setUpdating(false) }
  }

  if (loading) return <Loader />

  if (!emergency) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <FiNavigation className="text-slate-600 text-5xl mx-auto mb-4" />
      <h2 className="text-white font-bold text-xl mb-2">No Active Mission</h2>
      <p className="text-slate-400">You'll be notified when a mission is assigned.</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Active Mission</h1>
        <p className="text-slate-400 text-sm mt-1">Follow navigation and update status.</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-cyan-400/30 glow-cyan mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold text-sm tracking-wider">MISSION ACTIVE</span>
        </div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-black text-xl capitalize">{emergency.type?.replace('_', ' ')}</span>
              <SeverityBadge severity={emergency.severity} />
            </div>
            <StatusBadge status={emergency.status} />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 glass-light rounded-xl p-3">
            <FiMapPin className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Location</div>
              <div className="text-white text-sm">{emergency.location?.address || 'Location recorded'}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 glass-light rounded-xl p-3">
            <FiPhone className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Citizen</div>
              <div className="text-white text-sm">{emergency.citizen?.name}</div>
              <div className="text-cyan-400 text-sm">{emergency.citizen?.phone}</div>
            </div>
          </div>
          {emergency.assignedHospital && (
            <div className="flex items-start gap-3 glass-light rounded-xl p-3">
              <FiNavigation className="text-violet-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Destination Hospital</div>
                <div className="text-white text-sm">{emergency.assignedHospital.name}</div>
                <div className="text-slate-400 text-xs">{emergency.assignedHospital.address}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {emergency.status === 'dispatched' && (
            <Button onClick={() => updateStatus('en_route')} loading={updating} className="col-span-2">
              <FiNavigation /> Mark En Route
            </Button>
          )}
          {emergency.status === 'en_route' && (
            <Button onClick={() => updateStatus('arrived')} loading={updating} className="col-span-2" variant="secondary">
              Mark Arrived at Scene
            </Button>
          )}
          {emergency.status === 'arrived' && (
            <Button onClick={() => updateStatus('resolved')} loading={updating} className="col-span-2" variant="success">
              <FiCheckCircle /> Mark Resolved
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
