import { motion } from 'framer-motion'
import { FiDownload, FiAlertCircle, FiNavigation, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    icon: <FiDownload className="text-xl" />,
    title: 'Install & Register',
    desc: 'Download KavachAI, create your profile, and link emergency contacts in under 2 minutes.',
    color: 'text-cyan-400',
    border: 'border-cyan-400/30',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: <FiAlertCircle className="text-xl" />,
    title: 'Trigger SOS',
    desc: 'One tap, voice command, or auto-detection sends an encrypted alert with your live location.',
    color: 'text-red-400',
    border: 'border-red-400/30',
    bg: 'bg-red-400/10',
  },
  {
    icon: <FiNavigation className="text-xl" />,
    title: 'AI Dispatches Help',
    desc: 'Our engine selects the nearest unit, plots the fastest route, and notifies the hospital.',
    color: 'text-violet-400',
    border: 'border-violet-400/30',
    bg: 'bg-violet-400/10',
  },
  {
    icon: <FiCheckCircle className="text-xl" />,
    title: 'Help Arrives',
    desc: 'Track responders live, receive ETA updates, and get post-incident care recommendations.',
    color: 'text-green-400',
    border: 'border-green-400/30',
    bg: 'bg-green-400/10',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            From Signal to <span className="text-gradient">Safety in 4 Steps</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Designed for simplicity under pressure — because emergencies don't wait.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-20 h-20 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center ${step.color} mb-6 relative z-10 transition-all duration-300`}
                >
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#030712] border border-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
                    {i + 1}
                  </div>
                </motion.div>

                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
