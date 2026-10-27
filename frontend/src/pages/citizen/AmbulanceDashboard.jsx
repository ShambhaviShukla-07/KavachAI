
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiActivity,
  FiMapPin,
  FiTruck,
  FiClock,
  FiNavigation,
  FiShield,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi'

import RequestAmbulance from './RequestAmbulance'

const features = [
  {
    title: 'Nearby Ambulances',
    description: 'Find available ambulances near your location.',
    icon: FiMapPin
  },
  {
    title: 'Smart Ranking',
    description: 'Prioritize ambulances by distance and availability.',
    icon: FiNavigation
  },
  {
    title: 'Live Availability',
    description: 'Check whether an ambulance is available or busy.',
    icon: FiTruck
  },
  {
    title: 'Emergency Tracking',
    description: 'Monitor your request and assigned ambulance status.',
    icon: FiActivity
  }
]

const statusStyles = {
  pending: 'text-amber-300 bg-amber-400/10 border-amber-400/20'
}

const overviewCards = [
  {
    label: 'Nearby Ambulances',
    value: 'Awaiting data',
    icon: FiTruck,
    color: 'text-cyan-400'
  },
  {
    label: 'Available Vehicles',
    value: 'Awaiting data',
    icon: FiShield,
    color: 'text-emerald-400'
  },
  {
    label: 'Active Emergency',
    value: 'Not loaded',
    icon: FiActivity,
    color: 'text-amber-400'
  },
  {
    label: 'Estimated Arrival',
    value: 'Not available',
    icon: FiClock,
    color: 'text-blue-400'
  }
]

export default function AmbulanceDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(true)

  return (
    <div className="space-y-7 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-400">
            <FiActivity />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Emergency Response
            </span>
          </div>

          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Ambulance Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Request emergency assistance, discover nearby ambulances and
            monitor your emergency response.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestForm(value => !value)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          <FiAlertCircle />
          {showRequestForm ? 'Hide Request Form' : 'Request Emergency Help'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className={`text-xl ${item.color}`} />
              </div>

              <p className="mt-4 text-lg font-bold text-white">
                {item.value}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          {/* Request Help Form */}
          {showRequestForm && (
            <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">
                  Request Emergency Help
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Submit your emergency details and location.
                </p>
              </div>

              <RequestAmbulance />
            </section>
          )}

          {/* Nearby Ambulances */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Nearby Ambulances
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ambulances will be ranked by distance and availability.
                </p>
              </div>
              <FiNavigation className="mt-1 text-xl text-cyan-400" />
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-white/15 p-6 text-center">
              <FiMapPin className="mx-auto text-3xl text-slate-500" />
              <p className="mt-3 font-semibold text-white">
                Ambulance data not connected yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Available vehicles, their distance and ranking will appear
                here after connecting the nearby-ambulance API.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6 xl:col-span-2">
          {/* Active Emergency */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-400/10 p-3 text-amber-300">
                <FiActivity className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-white">Active Emergency</h2>
                <p className="text-xs text-slate-400">
                  Current request status
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles.pending}`}
              >
                Waiting for API
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your latest emergency request and status will appear here
                after connecting the emergency history API.
              </p>
            </div>
          </section>

          {/* Tracking */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                <FiMapPin className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-white">Ambulance Tracking</h2>
                <p className="text-xs text-slate-400">
                  Location and arrival updates
                </p>
              </div>
            </div>

            <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 p-5 text-center">
              <FiNavigation className="text-3xl text-slate-500" />
              <p className="mt-3 text-sm font-semibold text-white">
                Tracking not connected
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Live tracking will be available when an ambulance is assigned
                and location updates are received.
              </p>
            </div>
          </section>

          {/* Module Features */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <h2 className="font-bold text-white">Module Features</h2>

            <div className="mt-4 space-y-4">
              {features.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/5 p-2 text-cyan-300">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Integration Status */}
          <div className="flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <FiRefreshCw className="mt-0.5 flex-shrink-0 text-cyan-300" />
            <p className="text-xs leading-5 text-slate-400">
              Dashboard layout is ready. Live counts, ambulance ranking,
              emergency status and tracking still need backend integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

