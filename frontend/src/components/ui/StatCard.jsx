import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon, color = 'text-cyan-400', trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 hover:border-cyan-400/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center ${color} text-lg`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      {trend && <div className="text-xs text-slate-500 mt-1">{trend}</div>}
    </motion.div>
  )
}
