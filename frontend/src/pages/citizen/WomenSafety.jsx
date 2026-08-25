import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiPlus, FiTrash2 } from 'react-icons/fi'
import { womenSafetyService } from '../../services/womenSafetyService'
import { useGeolocation } from '../../hooks/useGeolocation'
import { StatusBadge } from '../../components/ui/SeverityBadge'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function WomenSafety() {
  const { location } = useGeolocation()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sosLoading, setSosLoading] = useState(false)
  const [contacts, setContacts] = useState([{ name: '', phone: '' }])

  useEffect(() => {
    womenSafetyService.getMySOS()
      .then(r => setAlerts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const triggerSOS = async () => {
    if (!location) { toast.error('Location required for SOS'); return }
    setSosLoading(true)
    try {
      const res = await womenSafetyService.triggerSOS({
        coordinates: location.coordinates,
        address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        emergencyContacts: contacts.filter(c => c.name && c.phone)
      })
      setAlerts(prev => [res.data.data.sos, ...prev])
      toast.success('SOS Alert triggered! Help is on the way.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'SOS failed')
    } finally {
      setSosLoading(false)
    }
  }

  const resolveAlert = async (id) => {
    try {
      await womenSafetyService.resolveSOS(id)
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'resolved' } : a))
      toast.success('SOS resolved')
    } catch { toast.error('Failed to resolve') }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Women Safety</h1>
        <p className="text-slate-400 text-sm mt-1">One tap SOS with live location sharing.</p>
      </div>

      <div className="glass rounded-2xl p-8 text-center mb-6 border border-pink-500/20">
        <p className="text-slate-400 text-sm mb-6">
          {location ? `Location ready: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Acquiring location...'}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={triggerSOS} disabled={sosLoading || !location}
          className="w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-black shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mx-auto flex flex-col items-center justify-center gap-1"
          style={{ boxShadow: '0 0 60px rgba(239,68,68,0.4)' }}
        >
          {sosLoading
            ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <><FiShield className="text-3xl" /><span className="text-sm">SOS</span></>}
        </motion.button>
        <p className="text-slate-500 text-xs mt-4">Tap to trigger emergency alert</p>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Emergency Contacts</h3>
          <button onClick={() => setContacts(c => [...c, { name: '', phone: '' }])}
            className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300">
            <FiPlus /> Add
          </button>
        </div>
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input value={c.name} onChange={e => setContacts(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                placeholder="Name" className="flex-1 glass-light rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none" />
              <input value={c.phone} onChange={e => setContacts(prev => prev.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))}
                placeholder="Phone" className="flex-1 glass-light rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none" />
              {contacts.length > 1 && (
                <button onClick={() => setContacts(prev => prev.filter((_, j) => j !== i))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-400/10">
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50"><h3 className="text-white font-bold">SOS History</h3></div>
        {loading ? <Loader /> : alerts.length === 0
          ? <div className="p-8 text-center text-slate-500">No SOS alerts yet.</div>
          : <div className="divide-y divide-slate-700/30">
            {alerts.map(a => (
              <div key={a._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">SOS Alert</div>
                  <div className="text-slate-500 text-xs">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  {a.status === 'active' && (
                    <button onClick={() => resolveAlert(a._id)}
                      className="text-xs px-3 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
