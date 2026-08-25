import { motion } from 'framer-motion'
import { MdOutlineSensors } from 'react-icons/md'
import { GiBrain } from 'react-icons/gi'
import { RiSendPlaneFill } from 'react-icons/ri'
import { FaHospitalAlt } from 'react-icons/fa'

const steps = [
  {
    icon: <MdOutlineSensors className="text-2xl" />,
    title: 'Emergency Detection',
    desc: 'Multi-channel SOS signals captured via app, wearable, or auto-crash detection in real time.',
    gradient: 'from-red-500 to-orange-400',
    glow: 'rgba(239,68,68,0.3)',
  },
  {
    icon: <GiBrain className="text-2xl" />,
    title: 'AI Risk Analysis',
    desc: 'Neural models assess severity, location density, and resource availability within milliseconds.',
    gradient: 'from-violet-500 to-indigo-400',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: <RiSendPlaneFill className="text-2xl" />,
    title: 'Smart Dispatch',
    desc: 'Optimal unit selected and routed using live traffic, fleet health, and proximity scoring.',
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.3)',
  },
  {
    icon: <FaHospitalAlt className="text-2xl" />,
    title: 'Hospital Response',
    desc: 'Nearest capable hospital pre-alerted with patient vitals and ETA for zero-delay intake.',
    gradient: 'from-green-400 to-emerald-500',
    glow: 'rgba(52,211,153,0.3)',
  },
]

export default function MissionPipeline() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">PIPELINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">The Mission Pipeline</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our AI-driven backbone ensures zero friction from the first signal to the hospital bay.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: `0 0 32px ${step.glow}` }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300 group"
            >
              {/* Step number */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  0{i + 1}
                </span>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow (not last) */}
              {i < steps.length - 1 && (
                <div className="lg:hidden flex justify-center mt-2">
                  <div className="w-px h-6 bg-gradient-to-b from-cyan-400/40 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
