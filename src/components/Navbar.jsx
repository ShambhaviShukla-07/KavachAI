import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi'
import { RiShieldFlashFill } from 'react-icons/ri'

const navLinks = ['Dashboard', 'Analytics', 'Fleet', 'Hospitals']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-cyan-400/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center glow-cyan-sm">
              <RiShieldFlashFill className="text-cyan-400 text-lg" />
            </div>
            <span className="text-xl font-bold text-cyan-400 tracking-tight">KavachAI</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-4 py-2 text-sm text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-lg transition-all duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 glass-light rounded-xl px-3 py-2 w-44">
              <FiSearch className="text-slate-500 text-sm flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
              />
            </div>

            {/* Icons */}
            {[FiBell, FiSettings].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-xl glass-light text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200"
              >
                <Icon className="text-base" />
              </button>
            ))}

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer glow-cyan-sm">
              KA
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
