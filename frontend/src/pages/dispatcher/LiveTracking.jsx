import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiRefreshCw } from 'react-icons/fi'
import { emergencyService } from '../../services/emergencyService'
import { ambulanceService } from '../../services/ambulanceService'
import { StatusBadge, SeverityBadge } from '../../components/ui/SeverityBadge'
import { useSocket } from '../../context/SocketContext'
import toast from 'react-hot-toast'

export default function LiveTracking() {
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(false)
  const socket = useSocket()

  const loadData = () => {
    setLoading(true)
    Promise.all([emergencyService.getAll(), ambulanceService.getAll()])
      .then(([e, a]) => { setEmergencies(e.data.data); setAmbulances(a.data.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('emergency_updated', e => setEmergencies(prev => prev.map(x => x._id === e._id ? e : x)))
    socket.on('ambulance_location', ({ id, coordinates }) => {
      setAmbulances(prev => prev.map(a => a._id === id ? { ...a, location: { coordinates } } : a))
    })
    return () => { socket.off('emergency_updated'); socket.off('ambulance_location') }
  }, [socket])

  const active = emergencies.filter(e => ['dispatched', 'en_route', 'arrived'].includes(e.status))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Live Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">{active.length} active missions</p>
        </div>
        <button onClick={loadData} disabled={loading}
          className="flex items-center gap-2 glass-light rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Map mockup */}
      <div className="glass rounded-2xl overflow-hidden mb-6 glow-cyan">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50">
          <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <FiMapPin className="text-cyan-400" /> Live City Map
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-semibold">LIVE</span>
          </div>
        </div>
        <div className="bg-[#060e1e] relative">
          <svg width="100%" viewBox="0 0 800 400" className="w-full">
            <defs>
              <pattern id="tgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
              </pattern>
              <filter id="tglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <rect width="800" height="400" fill="url(#tgrid)" />
            {[[20,20,120,60],[160,20,100,60],[280,20,140,60],[440,20,100,60],[560,20,120,60],[700,20,80,60],
              [20,100,80,70],[120,100,100,70],[240,100,140,70],[400,100,120,70],[540,100,100,70],[660,100,120,70],
              [20,200,100,70],[140,200,120,70],[280,200,100,70],[400,200,140,70],[560,200,100,70],[680,200,100,70],
              [20,300,120,80],[160,300,100,80],[280,300,140,80],[440,300,100,80],[560,300,120,80],[700,300,80,80]].map(([x,y,w,h],i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(15,23,42,0.9)" stroke="rgba(51,65,85,0.4)" strokeWidth="0.5" rx="3" />
            ))}
            {[[0,90,800,90],[0,190,800,190],[0,290,800,290],[110,0,110,400],[250,0,250,400],[390,0,390,400],[540,0,540,400],[660,0,660,400]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(71,85,105,0.4)" strokeWidth="1" />
            ))}
            {active.slice(0, 4).map((e, i) => {
              const cx = [200, 450, 300, 600][i] || 200
              const cy = [150, 250, 320, 150][i] || 150
              return (
                <g key={e._id}>
                  <motion.circle cx={cx} cy={cy} r="20" fill="none" stroke="#EF4444" strokeWidth="1"
                    animate={{ r: [14, 26], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
                  <circle cx={cx} cy={cy} r="7" fill="#EF4444" filter="url(#tglow)" />
                  <text x={cx + 10} y={cy + 4} fontSize="9" fill="#EF4444" fontWeight="bold">SOS</text>
                </g>
              )
            })}
            {ambulances.filter(a => a.status !== 'available').slice(0, 3).map((a, i) => {
              const cx = [180, 420, 280][i] || 180
              const cy = [130, 230, 300][i] || 130
              return (
                <g key={a._id}>
                  <motion.rect x={cx - 10} y={cy - 7} width="20" height="14" rx="3" fill="#22D3EE"
                    animate={{ x: [cx - 10, cx + 20, cx - 10] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i }} />
                  <text x={cx - 4} y={cy + 4} fontSize="8" fill="white" fontWeight="bold">+</text>
                </g>
              )
            })}
          </svg>
          <div className="absolute bottom-3 left-3 flex gap-4">
            {[{ c: 'bg-red-500', l: 'SOS' }, { c: 'bg-cyan-400', l: 'Ambulance' }, { c: 'bg-green-400', l: 'Hospital' }].map(l => (
              <div key={l.l} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.c}`} />
                <span className="text-xs text-slate-400">{l.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active missions list */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-bold">Active Missions</h3>
        </div>
        {active.length === 0
          ? <div className="p-8 text-center text-slate-500">No active missions.</div>
          : <div className="divide-y divide-slate-700/30">
            {active.map(e => (
              <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm capitalize">{e.type?.replace('_', ' ')}</span>
                    <SeverityBadge severity={e.severity} />
                  </div>
                  <div className="text-slate-500 text-xs">{e.location?.address}</div>
                  {e.assignedAmbulance && <div className="text-cyan-400 text-xs mt-0.5">Unit: {e.assignedAmbulance.vehicleNumber}</div>}
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>}
      </div>
    </div>
  )
}
