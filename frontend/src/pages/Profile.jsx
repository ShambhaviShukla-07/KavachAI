
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiShield, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cyan-400 mb-6"
      >
        <FiArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8">
        Your KavachAI account information
      </p>

      <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.name || 'User'}
            </h2>
            <p className="text-slate-400 text-sm">
              {user?.role || 'Citizen'}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <FiUser className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p>{user?.name || 'Not available'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiMail className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">Email Address</p>
              <p>{user?.email || 'Not available'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiShield className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">Account Role</p>
              <p>{user?.role || 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}