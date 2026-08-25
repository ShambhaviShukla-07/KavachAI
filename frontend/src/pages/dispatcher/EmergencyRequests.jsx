import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFilter } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import { ambulanceService } from '../../services/ambulanceService'
import { hospitalService } from '../../services/hospitalService'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'
import { useSocket } from '../../context/SocketContext'
import toast from 'react-hot-toast'

export default function EmergencyRequests() {
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [dispatchForm, setDispatchForm] = useState({ ambulanceId: '', hospitalId: '' })
  const [dispatching, setDispatching] = useState(false)
  const socket = useSocket()

  const loadData = () => Promise.all([
    emergencyService.getAll(),
    ambulanceService.getAvailable(),
    hospitalService.getAll()
  ]).then(([e, a, h]) => {
    setEmergencies(e.data.data)
    setAmbulances(a.data.data)
    setHospitals(h.data.data)
  }).catch(() => toast.error('Failed to load'))
    .finally(() => setLoading(false))

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('new_emergency', e => setEmergencies(prev => [e, ...prev]))
    socket.on('emergency_updated', e => setEmergencies(prev => prev.map(x => x._id === e._id ? e : x)))
    return () => { socket.off('new_emergency'); socket.off('emergency_updated') }
  }, [socket])

  const handleDispatch = async () => {
    if (!dispatchForm.ambulanceId) { toast.error('Select an ambulance'); return }
    setDispatching(true)
    try {
      await emergencyService.dispatch(selected._id, dispatchForm)
      toast.success('Emergency dispatched!')
      setSelected(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dispatch failed')
    } finally { setDispatching(false) }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await emergencyService.updateStatus(id, status)
      setEmergencies(prev => prev.map(e => e._id === id ? { ...e, status } : e))
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
  }

  const filtered = filter === 'all' ? emergencies : emergencies.filter(e => e.status === filter)

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Emergency Requests</h1>
          <p className="text-slate-400 text-sm mt-1">{emergencies.length} total emergencies</p>
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-slate-400" />
          {['all', 'pending', 'dispatched', 'en_route', 'resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-300'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0
          ? <div className="p-12 text-center text-slate-500">No emergencies found.</div>
          : <div className="divide-y divide-slate-700/30">
            {filtered.map(e => (
              <motion.div key={e._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="px-6 py-4 hover:bg-slate-700/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                      <SeverityBadge severity={e.severity} />
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="text-slate-400 text-xs mb-0.5">{e.location?.address || 'Location recorded'}</div>
                    <div className="text-slate-500 text-xs">
                      Citizen: {e.citizen?.name} · {e.citizen?.phone}
                      {e.assignedAmbulance && ` · Unit: ${e.assignedAmbulance.vehicleNumber}`}
                      {e.assignedHospital && ` · Hospital: ${e.assignedHospital.name}`}
                    </div>
                    <div className="text-slate-600 text-xs mt-0.5">{new Date(e.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {e.status === 'pending' && (
                      <Button size="sm" onClick={() => { setSelected(e); setDispatchForm({ ambulanceId: '', hospitalId: '' }) }}>
                        Dispatch
                      </Button>
                    )}
                    {e.status === 'dispatched' && (
                      <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(e._id, 'en_route')}>
                        Mark En Route
                      </Button>
                    )}
                    {e.status === 'en_route' && (
                      <Button size="sm" variant="success" onClick={() => handleStatusUpdate(e._id, 'resolved')}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>}
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Dispatch Emergency">
        {selected && (
          <div className="space-y-4">
            <div className="glass-light rounded-xl p-4">
              <div className="text-white font-semibold capitalize mb-1">{selected.type?.replace('_', ' ')}</div>
              <div className="text-slate-400 text-sm">{selected.location?.address}</div>
              <div className="text-slate-500 text-xs mt-1">{selected.citizen?.name} · {selected.citizen?.phone}</div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Select Ambulance *</label>
              <select value={dispatchForm.ambulanceId}
                onChange={e => setDispatchForm(f => ({ ...f, ambulanceId: e.target.value }))}
                className="w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 outline-none bg-transparent">
                <option value="" className="bg-slate-800">-- Select ambulance --</option>
                {ambulances.map(a => (
                  <option key={a._id} value={a._id} className="bg-slate-800">
                    {a.vehicleNumber} {a.driver ? `· ${a.driver.name}` : '· No driver'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Assign Hospital</label>
              <select value={dispatchForm.hospitalId}
                onChange={e => setDispatchForm(f => ({ ...f, hospitalId: e.target.value }))}
                className="w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 outline-none bg-transparent">
                <option value="" className="bg-slate-800">-- Select hospital --</option>
                {hospitals.map(h => (
                  <option key={h._id} value={h._id} className="bg-slate-800">
                    {h.name} · {h.availableBeds} beds
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelected(null)} className="flex-1">Cancel</Button>
              <Button loading={dispatching} onClick={handleDispatch} className="flex-1">Confirm Dispatch</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
