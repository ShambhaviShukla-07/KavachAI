import { motion } from 'framer-motion'
import { GiBrain } from 'react-icons/gi'
import { FiEye, FiTrendingUp, FiCpu } from 'react-icons/fi'
import { RiRobot2Fill } from 'react-icons/ri'

const capabilities = [
  { label: 'Incident Classification Accuracy', value: 97, color: 'from-cyan-400 to-blue-500' },
  { label: 'Route Optimization Speed', value: 99, color: 'from-violet-500 to-indigo-400' },
  { label: 'False Positive Reduction', value: 89, color: 'from-green-400 to-teal-500' },
  { label: 'Predictive Pre-positioning', value: 82, color: 'from-orange-400 to-red-500' },
]

const aiCards = [
  {
    icon: <GiBrain className="text-2xl" />,
    title: 'Neural Dispatch Engine',
    desc: 'Deep learning model trained on 10M+ emergency events for optimal unit selection.',
    gradient: 'from-violet-500 to-indigo-400',
  },
  {
    icon: <FiEye className="text-2xl" />,
    title: 'Computer Vision SOS',
    desc: 'Camera feeds analyzed in real-time to detect accidents, falls, and distress signals.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: <FiTrendingUp className="text-2xl" />,
    title: 'Predictive Hotspot Mapping',
    desc: 'ML models forecast high-risk zones 30 minutes ahead to pre-position resources.',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    icon: <FiCpu className="text-2xl" />,
    title: 'Edge AI Processing',
    desc: 'On-device inference ensures zero-latency response even in low-connectivity zones.',
    gradient: 'from-green-400 to-teal-500',
  },
]

export default function AICapabilities() {
  return (
    <section className="py-24 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <RiRobot2Fill className="text-cyan-400 text-xs" />
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">AI CAPABILITIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Intelligence at <span className="text-gradient">Every Layer</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Purpose-built AI models power every decision from detection to discharge.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: AI cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {aiCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-5 cursor-default transition-all duration-300 hover:border-cyan-400/20"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {c.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: Performance metrics */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-white font-bold text-xl mb-6">Model Performance</h3>
            <div className="space-y-6">
              {capabilities.map((cap, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">{cap.label}</span>
                    <span className="text-sm font-bold text-white">{cap.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cap.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${cap.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '10M+', label: 'Training Events' },
                { value: '<800ms', label: 'Inference Time' },
                { value: '99.7%', label: 'Model Accuracy' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-cyan-400">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
