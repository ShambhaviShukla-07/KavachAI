
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiMapPin,
  FiTruck,
  FiRefreshCw,
  FiExternalLink,
  FiActivity,
  FiAlertTriangle,
  FiClock
} from 'react-icons/fi'
import toast from 'react-hot-toast'

import { emergencyService } from '../../services/emergencyService'
import { ambulanceService } from '../../services/ambulanceService'

function extractData(response) {
  const body = response?.data
  return body?.data ?? body
}

function getCoordinates(location) {
  const coordinates = location?.coordinates

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return null
  }

  const longitude = Number(coordinates[0])
  const latitude = Number(coordinates[1])

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    return null
  }

  return { longitude, latitude }
}

function mapsUrl(location) {
  const coordinates = getCoordinates(location)

  if (!coordinates) return null

  return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
}

function formatTime(value) {
  if (!value) return 'Location time unavailable'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Location time unavailable'
    : date.toLocaleString()
}

function statusClass(status) {
  const classes = {
    pending: 'text-yellow-400',
    dispatched: 'text-cyan-400',
    en_route: 'text-blue-400',
    arrived: 'text-purple-400',
    resolved: 'text-emerald-400',
    cancelled: 'text-slate-400',
    available: 'text-emerald-400',
    at_scene: 'text-purple-400',
    returning: 'text-yellow-400',
    maintenance: 'text-red-400'
  }

  return classes[status] || 'text-slate-300'
}

export default function LiveTracking() {
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadTrackingData = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)

    try {
      const [emergencyResponse, ambulanceResponse] = await Promise.all([
        emergencyService.getAll(),
        ambulanceService.getAll()
      ])

      const emergencyData = extractData(emergencyResponse)
      const ambulanceData = extractData(ambulanceResponse)

      setEmergencies(Array.isArray(emergencyData) ? emergencyData : [])
      setAmbulances(Array.isArray(ambulanceData) ? ambulanceData : [])
      setLastUpdated(new Date())
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to load tracking information'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Refresh automatically every 15 seconds. No socket file is required.
  useEffect(() => {
    loadTrackingData(true)

    const interval = window.setInterval(() => {
      loadTrackingData(false)
    }, 15000)

    return () => {
      window.clearInterval(interval)
    }
  }, [loadTrackingData])

  const activeEmergencies = emergencies.filter(
    emergency => !['resolved', 'cancelled'].includes(emergency.status)
  )

  const filteredEmergencies =
    filter === 'active'
      ? activeEmergencies
      : filter === 'resolved'
        ? emergencies.filter(emergency => emergency.status === 'resolved')
        : emergencies

  const locatedAmbulances = ambulances.filter(
    ambulance => getCoordinates(ambulance.location)
  )

  const locatedEmergencies = emergencies.filter(
    emergency => getCoordinates(emergency.location)
  )

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
        <span className="text-sm text-slate-400">
          Loading tracking information...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Live Tracking
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor emergency locations and ambulance positions.
          </p>

          {lastUpdated && (
            <p className="mt-2 text-xs text-slate-500">
              <FiClock className="mr-1 inline" />
              Last refreshed: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => loadTrackingData(false)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-white transition hover:border-cyan-400 disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Emergencies"
          value={emergencies.length}
          icon={<FiAlertTriangle />}
        />

        <SummaryCard
          label="Active Emergencies"
          value={activeEmergencies.length}
          icon={<FiActivity />}
        />

        <SummaryCard
          label="Registered Ambulances"
          value={ambulances.length}
          icon={<FiTruck />}
        />

        <SummaryCard
          label="Ambulances With Coordinates"
          value={locatedAmbulances.length}
          icon={<FiMapPin />}
        />
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Location Overview
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Open individual locations in Google Maps.
            </p>
          </div>

          <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
            {locatedEmergencies.length} emergency locations ·{' '}
            {locatedAmbulances.length} ambulance locations
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <FiMapPin className="mb-2 text-xl text-red-400" />
            <p className="font-semibold text-white">Emergency locations</p>
            <p className="mt-1 text-sm text-slate-400">
              {locatedEmergencies.length} of {emergencies.length} requests
              have valid coordinates.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <FiTruck className="mb-2 text-xl text-cyan-400" />
            <p className="font-semibold text-white">Ambulance locations</p>
            <p className="mt-1 text-sm text-slate-400">
              {locatedAmbulances.length} of {ambulances.length} ambulances
              have valid coordinates.
            </p>
          </div>
        </div>

        {ambulances.some(ambulance => {
          const coordinates = getCoordinates(ambulance.location)
          return (
            coordinates?.longitude === 0 &&
            coordinates?.latitude === 0
          )
        }) && (
          <p className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-400">
            Some ambulances have default coordinates (0, 0). Update their
            locations before relying on tracking.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">
            Emergency Locations
          </h2>

          <select
            value={filter}
            onChange={event => setFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            aria-label="Filter emergencies"
          >
            <option value="all">All Emergencies</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {filteredEmergencies.length === 0 ? (
          <EmptyState message="No emergencies found for this filter." />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredEmergencies.map(emergency => {
              const coordinates = getCoordinates(emergency.location)
              const url = mapsUrl(emergency.location)

              return (
                <motion.article
                  key={emergency._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold capitalize text-white">
                        {(emergency.type || 'other').replaceAll('_', ' ')}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {emergency.citizen?.name || 'Citizen'}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold capitalize ${statusClass(
                        emergency.status
                      )}`}
                    >
                      {(emergency.status || 'pending').replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-500">Severity:</span>{' '}
                      {emergency.severity || 'high'}
                    </p>

                    <p>
                      <span className="text-slate-500">Address:</span>{' '}
                      {emergency.location?.address || 'Not provided'}
                    </p>

                    <p>
                      <span className="text-slate-500">Ambulance:</span>{' '}
                      {emergency.assignedAmbulance?.vehicleNumber ||
                        'Not assigned'}
                    </p>

                    <p>
                      <span className="text-slate-500">Driver:</span>{' '}
                      {emergency.assignedDriver?.name || 'Not assigned'}
                    </p>

                    {coordinates && (
                      <p className="break-words text-xs text-slate-500">
                        Coordinates: {coordinates.latitude.toFixed(6)},{' '}
                        {coordinates.longitude.toFixed(6)}
                      </p>
                    )}

                    <p className="text-xs text-slate-500">
                      Created: {formatTime(emergency.createdAt)}
                    </p>
                  </div>

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-cyan-400 transition hover:border-cyan-400"
                    >
                      <FiMapPin />
                      Open Emergency Location
                      <FiExternalLink />
                    </a>
                  ) : (
                    <p className="mt-4 text-xs text-yellow-400">
                      Location coordinates unavailable.
                    </p>
                  )}
                </motion.article>
              )
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Ambulance Locations
        </h2>

        {ambulances.length === 0 ? (
          <EmptyState message="No ambulances registered yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ambulances.map(ambulance => {
              const coordinates = getCoordinates(ambulance.location)
              const url = mapsUrl(ambulance.location)

              return (
                <article
                  key={ambulance._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-500/10 p-3 text-xl text-cyan-400">
                        <FiTruck />
                      </div>

                      <div>
                        <h3 className="font-bold text-white">
                          {ambulance.vehicleNumber}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Driver: {ambulance.driver?.name || 'Not assigned'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold capitalize ${statusClass(
                        ambulance.status
                      )}`}
                    >
                      {(ambulance.status || 'unknown').replaceAll('_', ' ')}
                    </span>
                  </div>

                  {coordinates ? (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400">
                        Coordinates: {coordinates.latitude.toFixed(6)},{' '}
                        {coordinates.longitude.toFixed(6)}
                      </p>

                      {coordinates.longitude === 0 &&
                        coordinates.latitude === 0 && (
                          <p className="mt-2 text-xs text-yellow-400">
                            These are default coordinates, not a verified
                            real-world position.
                          </p>
                        )}

                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-cyan-400 hover:border-cyan-400"
                        >
                          <FiMapPin />
                          Open Ambulance Location
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-yellow-400">
                      Ambulance location is not available.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="text-xl text-cyan-400">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
      <FiMapPin className="mx-auto mb-3 text-3xl text-slate-500" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
