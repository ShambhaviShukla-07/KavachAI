import { motion } from 'framer-motion'
import { RiMapPinFill } from 'react-icons/ri'
import { MdLocalHospital } from 'react-icons/md'
import { FiActivity, FiAlertTriangle } from 'react-icons/fi'
import { HiLightningBolt } from 'react-icons/hi'

const incidents = [
  { id: 'SOS-001', type: 'Medical', loc: 'Sector 12', eta: '3m 12s', status: 'Dispatched', color: 'text-green-400' },
  { id: 'SOS-002', type: 'Accident', loc: 'NH-48 Bypass', eta: '5m 40s', status: 'En Route', color: 'text-cyan-400' },
  { id: 'SOS-003', type: 'Women SOS', loc: 'Park Street', eta: '2m 05s', status: 'Critical', color: 'text-red-400' },
  { id: 'SOS-004', type: 'Fire', loc: 'Industrial Zone', eta: '7m 20s', status: 'Pending', color: 'text-yellow-400' },
]

const hospitals = [
  { name: 'City General', beds: 12, status: 'Available' },
  { name: 'Apollo ER', beds: 4, status: 'Limited' },
  { name: 'Metro Trauma', beds: 0, status: 'Full' },
]

export default function DashboardPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/60 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">LIVE PREVIEW</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Real-Time <span className="text-gradient">Command Center</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A unified view for dispatchers to monitor, coordinate, and respond at the speed of AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-2xl p-4 sm:p-6 glow-cyan"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300">KavachAI — Dispatch Console v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Map panel */}
            <div className="lg:col-span-2 glass-light rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/40">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <RiMapPinFill className="text-cyan-400" /> CITY MAP — LIVE
                </span>
                <span className="text-xs text-slate-500">Updated 0.3s ago</span>
              </div>
              <div className="relative bg-[#060e1e] p-2">
                <svg width="100%" viewBox="0 0 500 300" className="w-full">
                  <defs>
                    <pattern id="mapgrid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
                    </pattern>
                    <filter id="mapglow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <rect width="500" height="300" fill="url(#mapgrid)" />

                  {/* Roads */}
                  {[
                    [0,75,500,75],[0,150,500,150],[0,225,500,225],
                    [100,0,100,300],[200,0,200,300],[350,0,350,300],[450,0,450,300],
                  ].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(71,85,105,0.5)" strokeWidth="1" />
                  ))}

                  {/* City blocks */}
                  {[[10,10,80,55],[110,10,80,55],[210,10,130,55],[360,10,80,55],
                    [10,85,80,55],[110,85,80,55],[210,85,130,55],[360,85,80,55],[460,85,30,55],
                    [10,160,80,55],[110,160,80,55],[210,160,130,55],[360,160,80,55],
                    [10,235,80,55],[110,235,80,55],[210,235,130,55],[360,235,80,55]].map(([x,y,w,h],i) => (
                    <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(15,23,42,0.9)" stroke="rgba(51,65,85,0.5)" strokeWidth="0.5" rx="2" />
                  ))}

                  {/* Ambulance routes */}
                  {[
                    { points: '100,150 200,150 200,75', color: '#22D3EE' },
                    { points: '350,225 350,150 200,150', color: '#6366F1' },
                    { points: '100,225 100,150', color: '#22D3EE' },
                  ].map((r, i) => (
                    <motion.polyline key={i} points={r.points} fill="none" stroke={r.color}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      filter="url(#mapglow)"
                      strokeDasharray="8 4"
                      animate={{ strokeDashoffset: [0, -24] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                    />
                  ))}

                  {/* SOS markers */}
                  {[
                    { cx: 200, cy: 150, color: '#EF4444', label: 'SOS' },
                    { cx: 350, cy: 225, color: '#F59E0B', label: 'SOS' },
                    { cx: 100, cy: 225, color: '#EF4444', label: 'SOS' },
                  ].map((m, i) => (
                    <g key={i}>
                      <motion.circle cx={m.cx} cy={m.cy} r="16" fill="none" stroke={m.color} strokeWidth="1"
                        animate={{ r: [12, 22], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                      />
                      <circle cx={m.cx} cy={m.cy} r="6" fill={m.color} filter="url(#mapglow)" />
                      <text x={m.cx + 9} y={m.cy + 4} fontSize="8" fill={m.color} fontWeight="bold">{m.label}</text>
                    </g>
                  ))}

                  {/* Ambulances */}
                  {[
                    { x: 100, y: 143, animX: [100, 200], animY: [143, 143] },
                    { x: 350, y: 218, animX: [350, 350], animY: [218, 155] },
                  ].map((a, i) => (
                    <motion.g key={i}
                      animate={{ x: a.animX.map(v => v - a.x), y: a.animY.map(v => v - a.y) }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i }}
                    >
                      <rect x={a.x - 8} y={a.y - 5} width="16" height="11" rx="2" fill="#22D3EE" />
                      <text x={a.x - 3} y={a.y + 4} fontSize="7" fill="white" fontWeight="bold">+</text>
                    </motion.g>
                  ))}

                  {/* Hospital markers */}
                  {[[100,75],[350,75]].map(([cx,cy],i) => (
                    <g key={i}>
                      <rect x={cx-8} y={cy-8} width="16" height="16" rx="3" fill="rgba(52,211,153,0.2)" stroke="#34D399" strokeWidth="1" />
                      <text x={cx-4} y={cy+5} fontSize="10" fill="#34D399" fontWeight="bold">H</text>
                    </g>
                  ))}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex gap-3">
                  {[
                    { color: 'bg-red-500', label: 'SOS' },
                    { color: 'bg-cyan-400', label: 'Ambulance' },
                    { color: 'bg-green-400', label: 'Hospital' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${l.color}`} />
                      <span className="text-xs text-slate-400">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panels */}
            <div className="flex flex-col gap-4">
              {/* Active incidents */}
              <div className="glass-light rounded-xl overflow-hidden flex-1">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/40">
                  <FiAlertTriangle className="text-red-400 text-xs" />
                  <span className="text-xs font-semibold text-slate-400">ACTIVE INCIDENTS</span>
                  <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                    {incidents.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                      <div>
                        <div className="text-xs font-semibold text-white">{inc.type}</div>
                        <div className="text-xs text-slate-500">{inc.loc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-cyan-400 font-mono">{inc.eta}</div>
                        <div className={`text-xs font-semibold ${inc.color}`}>{inc.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospital availability */}
              <div className="glass-light rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/40">
                  <MdLocalHospital className="text-green-400 text-xs" />
                  <span className="text-xs font-semibold text-slate-400">HOSPITALS</span>
                </div>
                {hospitals.map((h) => (
                  <div key={h.name} className="px-4 py-2.5 flex items-center justify-between border-b border-slate-700/20 last:border-0">
                    <div>
                      <div className="text-xs font-semibold text-white">{h.name}</div>
                      <div className="text-xs text-slate-500">{h.beds} beds free</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      h.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                      h.status === 'Limited' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{h.status}</span>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Avg ETA', value: '4.2m', icon: <FiActivity />, color: 'text-cyan-400' },
                  { label: 'Fleet Active', value: '94%', icon: <HiLightningBolt />, color: 'text-green-400' },
                ].map((m) => (
                  <div key={m.label} className="glass-light rounded-xl p-3 text-center">
                    <div className={`text-base ${m.color} flex justify-center mb-1`}>{m.icon}</div>
                    <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
                    <div className="text-xs text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
