import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiAlertCircle } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import { useGeolocation } from '../../hooks/useGeolocation'
import { EMERGENCY_TYPES } from '../../utils/constants'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function RequestAmbulance() {
  const { location, error: geoError } = useGeolocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ type: 'medical', severity: 'high', description: '', address: '' })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!location) { toast.error('Location access required. Please allow location.'); return }
    setLoading(true)
    try {
      await emergencyService.create({
        ...form,
        coordinates: location.coordinates,
        address: form.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      })
      toast.success('Emergency request sent! Help is on the way.')
      navigate('/citizen/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400/50 transition-all'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Request Emergency Help</h1>
        <p className="text-slate-400 text-sm mt-1">Fill in the details and we'll dispatch help immediately.</p>
      </div>

      {geoError && (
        <div className="glass rounded-xl p-4 border border-yellow-500/30 mb-6 flex items-center gap-3">
          <FiMapPin className="text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-400 text-sm">Location access denied. Please enable location for accurate dispatch.</p>
        </div>
      )}

      {location && (
        <div className="glass rounded-xl p-4 border border-green-500/30 mb-6 flex items-center gap-3">
          <FiMapPin className="text-green-400 flex-shrink-0" />
          <p className="text-green-400 text-sm">Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Emergency Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EMERGENCY_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => set('type', t.value)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all border ${form.type === t.value ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400' : 'glass-light text-slate-400 hover:border-slate-600'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Severity</label>
            <div className="grid grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'critical'].map(s => (
                <button key={s} type="button" onClick={() => set('severity', s)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${form.severity === s ? 'border-red-400/50 bg-red-400/10 text-red-400' : 'glass-light text-slate-400 hover:border-slate-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Address / Landmark</label>
            <input value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="e.g. Near City Mall, MG Road" className={inputCls} />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Description (optional)</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the emergency situation..." rows={3}
              className={`${inputCls} resize-none`} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} variant="danger" className="flex-1 bg-red-500 text-white border-0 hover:bg-red-600">
              <FiAlertCircle /> Send Emergency Request
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
