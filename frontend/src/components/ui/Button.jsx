import { motion } from 'framer-motion'

const variants = {
  primary:   'bg-cyan-400 text-[#030712] hover:bg-cyan-300 font-bold shadow-sm',
  secondary: 'glass border border-slate-700 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 font-semibold',
  danger:    'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-semibold',
  success:   'bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 font-semibold',
  ghost:     'text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/5 font-medium',
  warning:   'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30 font-semibold',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
}

export default function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : children}
    </motion.button>
  )
}
