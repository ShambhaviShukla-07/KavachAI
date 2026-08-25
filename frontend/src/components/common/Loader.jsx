import { RiShieldFlashFill } from 'react-icons/ri'

export default function Loader({ fullScreen = false }) {
  if (fullScreen) return (
    <div className="fixed inset-0 bg-[#030712] flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 flex items-center justify-center glow-cyan-sm mb-4 animate-pulse">
        <RiShieldFlashFill className="text-cyan-400 text-3xl" />
      </div>
      <div className="text-cyan-400 font-bold text-xl tracking-wide">KavachAI</div>
      <div className="text-slate-500 text-sm mt-1">Loading...</div>
    </div>
  )
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
