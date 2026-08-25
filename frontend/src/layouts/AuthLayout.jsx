import { Outlet, Link } from 'react-router-dom'
import { RiShieldFlashFill } from 'react-icons/ri'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#030712] bg-grid flex items-center justify-center p-4">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-cyan-400/20 flex items-center justify-center glow-cyan-sm group-hover:scale-105 transition-transform">
              <RiShieldFlashFill className="text-cyan-400 text-xl" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-cyan-400 leading-none">KavachAI</div>
              <div className="text-xs text-slate-500">Emergency Response Platform</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow-cyan">
          <Outlet />
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Secured with JWT · Data stored in MongoDB
        </p>
      </div>
    </div>
  )
}
