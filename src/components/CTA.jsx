import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar } from 'react-icons/fi'
import { RiShieldFlashFill } from 'react-icons/ri'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-cyan-400/6 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-10 sm:p-16 text-center glow-cyan"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-6 glow-cyan-sm">
            <RiShieldFlashFill className="text-cyan-400 text-3xl" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Ready to Deploy <span className="text-gradient">KavachAI</span>?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join emergency services across India using AI to save lives. Get your city onboarded in 48 hours.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(34,211,238,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-cyan-400 text-[#030712] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200"
            >
              Get Started Free <FiArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 glass border border-slate-700 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200"
            >
              <FiCalendar /> Schedule Demo
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-slate-700/50">
            {['SOC 2 Certified', 'HIPAA Compliant', 'ISO 27001', '99.9% SLA'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-slate-400 font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
