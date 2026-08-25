import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { RiDoubleQuotesL } from 'react-icons/ri'

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Chief of Emergency, Apollo Hospital',
    quote: 'KavachAI cut our patient intake prep time by 40%. The pre-arrival vitals feed is a game changer for our trauma team.',
    avatar: 'PS',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'Cmdr. Rajesh Nair',
    role: 'Head of Dispatch, Mumbai Emergency Services',
    quote: 'The AI routing engine handles peak-hour complexity better than our entire manual team. Response times are down 35%.',
    avatar: 'RN',
    gradient: 'from-violet-500 to-indigo-400',
  },
  {
    name: 'Ananya Krishnan',
    role: 'Women Safety Advocate & NGO Director',
    quote: 'The silent SOS and trusted contact system has already helped dozens of women in our community. This is life-saving tech.',
    avatar: 'AK',
    gradient: 'from-pink-500 to-rose-400',
  },
]

export default function Testimonials() {
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
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Trusted by <span className="text-gradient">First Responders</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Hear from the professionals who rely on KavachAI every day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300 hover:border-cyan-400/20"
            >
              <RiDoubleQuotesL className="text-cyan-400/40 text-3xl" />

              <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>

              {/* Stars */}
              <div className="flex gap-1">
                {Array(5).fill(0).map((_, j) => (
                  <FiStar key={j} className="text-yellow-400 text-xs fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
