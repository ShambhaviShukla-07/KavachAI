import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PublicLayout() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#030712]">
      <Outlet />
    </motion.div>
  )
}
