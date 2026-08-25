import { useState, useEffect } from 'react'
import { FiTruck, FiPlus, FiEdit2 } from 'react-icons/fi'
import { ambulanceService } from '../../services/ambulanceService'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

export default function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ vehicleNumber: '', fuelLevel: 100, healthScore: 100 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ambulanceService.getAll()
      .then(r => setAmbulances(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await ambulanceService.create(form)
      setAmbulances(prev => [...prev, res.data.data])
      setShowModal(false)
      setForm({ vehicleNumber: '', fuelLevel: 100, healthScore: 100 })
      toast.success('Ambulance added')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add')
    } finally { setSaving(false) }
  }

  const statusColor = (s) => ({
    available: 'bg-green-500/20 text-green-400',
    dispatched: 'bg-cyan-500/20 text-cyan-400',
    en_route: 'bg-blue-500/20 text-blue-400',
    maintenance: 'bg-red-500/20 text-red-400',
    returning: 'bg-yellow-500/20 text-yellow-400'
  }[s] || 'bg-slate-500/20 text-slate-400')

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Ambulance Fleet</h1>
          <p className="text-slate-400 text-sm mt-1">{ambulances.length} vehicles registered</p>
        </div>
        <Button onClick={() => setShowModal(true)}><FiPlus /> Add Ambulance</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ambulances.map(a => (
          <div key={a._id} className="glass rounded-2xl p-5 hover:border-cyan-400/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <FiTruck className="text-cyan-400" />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor(a.status)}`}>
                {a.status}
              </span>
            </div>
            <div className="text-white font-bold text-lg mb-1">{a.vehicleNumber}</div>
            <div className="text-slate-400 text-sm mb-3">{a.driver?.name || 'No driver assigned'}</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Fuel</span>
                  <span className="text-slate-300">{a.fuelLevel}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: `${a.fuelLevel}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Health</span>
                  <span className="text-slate-300">{a.healthScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full" style={{ width: `${a.healthScore}%` }} />
                </div>
              </div>
            </div>
            <div className="text-slate-500 text-xs mt-3">Total trips: {a.totalTrips}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Ambulance">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Vehicle Number *</label>
            <input required value={form.vehicleNumber} onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value }))}
              placeholder="e.g. MH-01-AB-1234"
              className="w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Fuel Level (%)</label>
              <input type="number" min="0" max="100" value={form.fuelLevel}
                onChange={e => setForm(f => ({ ...f, fuelLevel: +e.target.value }))}
                className="w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 outline-none" />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Health Score (%)</label>
              <input type="number" min="0" max="100" value={form.healthScore}
                onChange={e => setForm(f => ({ ...f, healthScore: +e.target.value }))}
                className="w-full glass-light rounded-xl px-4 py-3 text-sm text-slate-200 outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Add Ambulance</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
