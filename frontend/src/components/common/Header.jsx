import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiMenu, FiSearch } from 'react-icons/fi'
import { RiShieldFlashFill } from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'

const roleBadge = {
  citizen:        { label: 'Citizen',        color: 'bg-cyan-400/20 text-cyan-400' },
  dispatcher:     { label: 'Dispatcher',     color: 'bg-violet-400/20 text-violet-400' },
  driver:         { label: 'Driver',         color: 'bg-green-400/20 text-green-400' },
  hospital_admin: { label: 'Hospital Admin', color: 'bg-pink-400/20 text-pink-400' },
}

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const rb = roleBadge[user?.role] || { label: user?.role, color: 'bg-slate-400/20 text-slate-400' }

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
      style={{ background: 'rgba(3,7,18,0.9)', borderBottom: '1px solid rgba(34,211,238,0.08)', backdropFilter: 'blur(12px)' }}>

      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.1)' }}>
          <FiMenu />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 w-56"
          style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FiSearch className="text-slate-500 text-sm flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full ${rb.color}`}>
          {rb.label}
        </span>

        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FiBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        {/* Avatar / Profile */}
<button
  type="button"
  onClick={() => {
    navigate('/profile')
  }}
  className="flex items-center gap-2 rounded-xl p-1 text-left hover:bg-white/5 transition-colors"
  title="Open Profile"
>
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-black text-white glow-cyan-sm">
    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
  </div>

  <div className="hidden md:block">
    <div className="text-white text-sm font-semibold leading-none">
      {user?.name || 'User'}
    </div>
    <div className="text-slate-500 text-xs mt-0.5">
      {user?.email || ''}
    </div>
  </div>
</button>
      </div>
    </header>
  )
}
