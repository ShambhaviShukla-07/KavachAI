import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlay, FiShield, FiZap, FiUsers, FiActivity } from 'react-icons/fi'
import { RiShieldFlashFill, RiMapPinFill } from 'react-icons/ri'
import { MdLocalHospital } from 'react-icons/md'
import { HiLightningBolt } from 'react-icons/hi'

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay } })

const stats = [{ value: '35%', label: 'Faster Response' }, { value: '2.4K', label: 'Active Units' }, { value: '99.9%', label: 'Uptime' }]

const features = [
  { icon: <FiZap />, title: 'Sub-Second Dispatch', desc: 'AI selects optimal unit in under 800ms.', gradient: 'from-yellow-400 to-orange-500' },
  { icon: <FiShield />, title: 'Women Safety Shield', desc: 'Silent SOS with live location sharing.', gradient: 'from-pink-500 to-rose-400' },
  { icon: <FiUsers />, title: 'Multi-Agency Coordination', desc: 'Police, fire, medical on one platform.', gradient: 'from-green-400 to-teal-500' },
  { icon: <FiActivity />, title: 'Predictive Analytics', desc: 'Pre-position units before emergencies.', gradient: 'from-violet-500 to-purple-400' },
  { icon: <MdLocalHospital />, title: 'Hospital Network', desc: 'Real-time bed availability & pre-alerts.', gradient: 'from-cyan-400 to-blue-500' },
  { icon: <RiMapPinFill />, title: 'Live City Map', desc: 'Real-time traffic & route optimization.', gradient: 'from-indigo-400 to-cyan-500' }
]

function MapMockup() {
  return (
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-lg mx-auto">
      <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-3xl scale-110" />
      <div className="relative glass rounded-2xl p-4 glow-cyan">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /></div>
          <span className="text-xs text-cyan-400 font-semibold tracking-widest">KAVACHAI COMMAND</span>
          <span className="text-xs text-slate-500">LIVE</span>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-[#0a1628] border border-slate-700/50 mb-3">
          <svg width="100%" viewBox="0 0 340 220" className="w-full">
            <defs>
              <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" /></pattern>
              <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <rect width="340" height="220" fill="url(#g2)" />
            {[[20,20,60,35],[100,20,80,30],[200,20,70,30],[280,20,50,35],[20,75,50,45],[90,80,60,35],[170,65,80,45],[270,75,50,40],[20,145,70,35],[110,135,60,45],[190,145,70,35],[280,140,50,40]].map(([x,y,w,h],i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(30,41,59,0.8)" stroke="rgba(71,85,105,0.4)" strokeWidth="0.5" rx="2" />
            ))}
            {[{x1:60,y1:70,x2:180,y2:120,c:'#22D3EE'},{x1:180,y1:120,x2:280,y2:90,c:'#22D3EE'},{x1:100,y1:135,x2:220,y2:170,c:'#6366F1'}].map((r,i) => (
              <motion.line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={r.c} strokeWidth="2" strokeLinecap="round" filter="url(#glow2)"
                animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i*0.5 }} />
            ))}
            {[{cx:180,cy:120,c:'#EF4444'},{cx:100,cy:135,c:'#22D3EE'},{cx:260,cy:90,c:'#EF4444'}].map((m,i) => (
              <g key={i}><motion.circle cx={m.cx} cy={m.cy} r="14" fill="none" stroke={m.c} strokeWidth="1" animate={{r:[10,18],opacity:[0.5,0]}} transition={{duration:2,repeat:Infinity,delay:i*0.6}} /><circle cx={m.cx} cy={m.cy} r="5" fill={m.c} filter="url(#glow2)" /></g>
            ))}
          </svg>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 border border-red-500/40 rounded-full px-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /><span className="text-red-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[{l:'Active SOS',v:'12',c:'text-red-400'},{l:'Fleet Health',v:'94%',c:'text-green-400'},{l:'Hospitals',v:'8/10',c:'text-cyan-400'}].map(s => (
            <div key={s.l} className="glass-light rounded-xl p-2 text-center">
              <div className={`text-sm font-bold ${s.c}`}>{s.v}</div>
              <div className="text-xs text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="glass-light rounded-xl p-3 flex items-center justify-between">
          <div><div className="text-xs text-slate-500 mb-0.5">Nearest Unit ETA</div><div className="text-lg font-bold text-cyan-400">3m 42s</div></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-xs text-green-400 font-semibold">EN ROUTE</span></div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyan-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center glow-cyan-sm">
              <RiShieldFlashFill className="text-cyan-400 text-lg" />
            </div>
            <span className="text-xl font-bold text-cyan-400">KavachAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'About'].map(l => (
              <a key={l} href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium">Sign In</Link>
            <Link to="/register" className="bg-cyan-400 text-[#030712] font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyan-300 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-grid">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-400 tracking-widest">NEXT-GEN DISPATCH ENGINE</span>
              </motion.div>
              <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-white">Revolutionizing</span><br />
                <span className="text-white">Emergency</span><br />
                <span className="text-gradient">Response with AI</span>
              </motion.h1>
              <motion.p {...fadeUp(0.35)} className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                KavachAI orchestrates a high-precision ecosystem of citizens, dispatchers and hospitals to save critical seconds when they matter most.
              </motion.p>
              <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4 mb-12">
                <Link to="/register">
                  <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(34,211,238,0.4)' }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-cyan-400 text-[#030712] font-bold px-6 py-3 rounded-xl text-sm">
                    Get Started <FiArrowRight />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 glass border border-slate-700 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 font-semibold px-6 py-3 rounded-xl text-sm">
                    <FiPlay className="text-cyan-400" /> Sign In
                  </motion.button>
                </Link>
              </motion.div>
              <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-8">
                {stats.map((s, i) => (
                  <div key={i}><div className="text-2xl font-black text-cyan-400">{s.value}</div><div className="text-sm text-slate-500">{s.label}</div></div>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <MapMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Built for <span className="text-gradient">Critical Moments</span></h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Every feature engineered to shave seconds off response time.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 cursor-default transition-all duration-300 hover:border-cyan-400/20">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white text-lg mb-4`}>{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-3xl p-12 glow-cyan">
            <h2 className="text-4xl font-black text-white mb-4">Ready to <span className="text-gradient">Save Lives</span>?</h2>
            <p className="text-slate-400 mb-8">Join the KavachAI network. Register as a citizen, dispatcher, driver, or hospital admin.</p>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(34,211,238,0.5)' }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-cyan-400 text-[#030712] font-bold px-8 py-4 rounded-xl text-base">
                Get Started Free <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RiShieldFlashFill className="text-cyan-400" />
          <span className="text-cyan-400 font-bold">KavachAI</span>
        </div>
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} KavachAI Technologies. All rights reserved.</p>
      </footer>
    </div>
  )
}
