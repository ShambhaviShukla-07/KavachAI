import { motion } from 'framer-motion'
import { FiPlay, FiArrowRight } from 'react-icons/fi'
import { RiShieldFlashFill, RiMapPinFill } from 'react-icons/ri'
import { MdLocalHospital } from 'react-icons/md'
import { HiLightningBolt } from 'react-icons/hi'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

const stats = [
  { value: '35%', label: 'Faster Response' },
  { value: '2.4K', label: 'Active Units' },
  { value: '99.9%', label: 'Uptime' },
]

/* ── Floating Dashboard Mockup ── */
function DashboardMockup() {
  const routes = [
    { x1: 60, y1: 80, x2: 180, y2: 140, color: '#22D3EE' },
    { x1: 180, y1: 140, x2: 280, y2: 100, color: '#22D3EE' },
    { x1: 100, y1: 160, x2: 220, y2: 200, color: '#6366F1' },
    { x1: 220, y1: 200, x2: 300, y2: 170, color: '#6366F1' },
    { x1: 50, y1: 200, x2: 150, y2: 240, color: '#334155' },
    { x1: 150, y1: 240, x2: 260, y2: 230, color: '#334155' },
  ]
  const markers = [
    { cx: 180, cy: 140, color: '#EF4444', r: 6 },
    { cx: 100, cy: 160, color: '#22D3EE', r: 5 },
    { cx: 260, cy: 100, color: '#EF4444', r: 5 },
    { cx: 220, cy: 200, color: '#22D3EE', r: 5 },
  ]

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-3xl scale-110" />

      <div className="relative glass rounded-2xl p-4 glow-cyan">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-cyan-400 font-semibold tracking-widest">KAVACHAI COMMAND</span>
          <span className="text-xs text-slate-500">LIVE</span>
        </div>

        {/* Map area */}
        <div className="relative rounded-xl overflow-hidden bg-[#0a1628] border border-slate-700/50 mb-3">
          <svg width="100%" viewBox="0 0 340 260" className="w-full">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="340" height="260" fill="url(#grid)" />

            {/* City blocks */}
            {[[20,20,60,40],[100,20,80,30],[200,20,70,35],[280,20,50,40],
              [20,80,50,50],[90,90,60,40],[170,70,80,50],[270,80,50,45],
              [20,160,70,40],[110,150,60,50],[190,160,70,40],[280,155,50,45],
              [20,220,80,30],[120,215,70,30],[210,220,60,30]].map(([x,y,w,h],i) => (
              <rect key={i} x={x} y={y} width={w} height={h}
                fill="rgba(30,41,59,0.8)" stroke="rgba(71,85,105,0.4)" strokeWidth="0.5" rx="2" />
            ))}

            {/* Animated routes */}
            {routes.map((r, i) => (
              <motion.line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                stroke={r.color} strokeWidth="2" strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
              />
            ))}

            {/* Markers */}
            {markers.map((m, i) => (
              <g key={i}>
                <motion.circle cx={m.cx} cy={m.cy} r={m.r + 6}
                  fill="none" stroke={m.color} strokeWidth="1" opacity={0.4}
                  animate={{ r: [m.r + 4, m.r + 12], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
                <circle cx={m.cx} cy={m.cy} r={m.r} fill={m.color} filter="url(#glow)" />
              </g>
            ))}

            {/* Ambulance icon */}
            <motion.g
              animate={{ x: [0, 80, 80], y: [0, 0, 60] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <rect x={95} y={155} width={14} height={10} rx="2" fill="#22D3EE" />
              <text x={98} y={163} fontSize="6" fill="white" fontWeight="bold">+</text>
            </motion.g>
          </svg>

          {/* Live badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 border border-red-500/40 rounded-full px-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Active SOS', value: '12', color: 'text-red-400', icon: <RiMapPinFill /> },
            { label: 'Fleet Health', value: '94%', color: 'text-green-400', icon: <HiLightningBolt /> },
            { label: 'Hospitals', value: '8/10', color: 'text-cyan-400', icon: <MdLocalHospital /> },
          ].map((s) => (
            <div key={s.label} className="glass-light rounded-xl p-2 text-center">
              <div className={`text-base ${s.color} flex justify-center mb-0.5`}>{s.icon}</div>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ETA card */}
        <div className="glass-light rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Nearest Unit ETA</div>
            <div className="text-lg font-bold text-cyan-400">3m 42s</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">Dispatch Status</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">EN ROUTE</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
            <RiShieldFlashFill className="text-cyan-400 text-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-grid">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400 tracking-widest">NEXT-GEN DISPATCH ENGINE</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Revolutionizing</span>
              <br />
              <span className="text-white">Emergency</span>
              <br />
              <span className="text-gradient">Response with AI</span>
            </motion.h1>

            <motion.p {...fadeUp(0.35)} className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              KavachAI orchestrates a high-precision ecosystem of citizens, dispatchers and hospitals to save critical seconds when they matter most.
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(34,211,238,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-cyan-400 text-[#030712] font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200"
              >
                Get Started <FiArrowRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 glass border border-slate-700 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
              >
                <FiPlay className="text-cyan-400" /> Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-8">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-cyan-400">{s.value}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
