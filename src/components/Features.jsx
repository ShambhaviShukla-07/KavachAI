import { motion } from 'framer-motion'
import { FiZap, FiShield, FiMap, FiActivity, FiUsers, FiClock } from 'react-icons/fi'

const features = [
  {
    icon: <FiZap />,
    title: 'Sub-Second Dispatch',
    desc: 'AI selects and routes the optimal emergency unit in under 800ms from signal receipt.',
    gradient: 'from-yellow-400 to-orange-500',
    span: 'lg:col-span-1',
  },
  {
    icon: <FiShield />,
    title: 'Women Safety Shield',
    desc: 'Dedicated SOS mode with silent alerts, live location sharing, and trusted contact pings.',
    gradient: 'from-pink-500 to-rose-400',
    span: 'lg:col-span-1',
  },
  {
    icon: <FiMap />,
    title: 'Live City Intelligence',
    desc: 'Real-time traffic, road closures, and crowd density feed into every routing decision.',
    gradient: 'from-cyan-400 to-blue-500',
    span: 'lg:col-span-2',
  },
  {
    icon: <FiActivity />,
    title: 'Predictive Analytics',
    desc: 'Historical incident data trains models to pre-position units before emergencies occur.',
    gradient: 'from-violet-500 to-purple-400',
    span: 'lg:col-span-2',
  },
  {
    icon: <FiUsers />,
    title: 'Multi-Agency Coordination',
    desc: 'Police, fire, and medical units share a unified command view for seamless collaboration.',
    gradient: 'from-green-400 to-teal-500',
    span: 'lg:col-span-1',
  },
  {
    icon: <FiClock />,
    title: '24/7 Uptime SLA',
    desc: '99.9% guaranteed uptime backed by multi-region failover and edge deployment.',
    gradient: 'from-indigo-400 to-cyan-500',
    span: 'lg:col-span-1',
  },
]

export default function Features() {
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
            <span className="text-xs font-semibold text-cyan-400 tracking-widest">FEATURES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Built for <span className="text-gradient">Critical Moments</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every feature engineered to shave seconds off response time and save lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group cursor-default transition-all duration-300 hover:border-cyan-400/20"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white text-lg mb-4 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
