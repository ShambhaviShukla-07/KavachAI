
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiRefreshCw,
  FiMapPin,
  FiTruck,
  FiUser,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi'
import toast from 'react-hot-toast'

import { emergencyService } from '../../services/emergencyService'
import { ambulanceService } from '../../services/ambulanceService'
import { hospitalService } from '../../services/hospitalService'

import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'

const STATUS_OPTIONS = {
  pending: ['dispatched', 'cancelled'],
  dispatched: ['en_route', 'arrived', 'resolved', 'cancelled'],
  en_route: ['arrived', 'resolved', 'cancelled'],
  arrived: ['resolved', 'cancelled']
}

const STATUS_LABELS = {
  pending: 'Pending',
  dispatched: 'Dispatched',
  en_route: 'En Route',
  arrived: 'Arrived',
  resolved: 'Resolved',
  cancelled: 'Cancelled'
}

const SEVERITY_COLORS = {
  low: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  high: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  critical: 'text-red-400 border-red-500/30 bg-red-500/10'
}

const STATUS_COLORS = {
  pending: 'text-yellow-400',
  dispatched: 'text-cyan-400',
  en_route: 'text-blue-400',
  arrived: 'text-purple-400',
  resolved: 'text-emerald-400',
  cancelled: 'text-slate-400'
}

function getData(response) {
  const body = response?.data
  return body?.data ?? body
}

function getId(value) {
  return value?._id ?? value ?? ''
}

function formatDate(date) {
  if (!date) return '—'

  const parsed = new Date(date)

  return Number.isNaN(parsed.getTime())
    ? '—'
    : parsed.toLocaleString()
}

export default function EmergencyRequests() {
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState(null)
  const [dispatchForm, setDispatchForm] = useState({
    ambulanceId: '',
    driverId: '',
    hospitalId: ''
  })

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)

    try {
      const [emergencyResponse, ambulanceResponse, hospitalResponse] =
        await Promise.all([
          emergencyService.getAll(),
          ambulanceService.getAvailable(),
          hospitalService.getAll()
        ])

      const emergencyData = getData(emergencyResponse)
      const ambulanceData = getData(ambulanceResponse)
      const hospitalData = getData(hospitalResponse)

      setEmergencies(Array.isArray(emergencyData) ? emergencyData : [])
      setAmbulances(Array.isArray(ambulanceData) ? ambulanceData : [])
      setHospitals(Array.isArray(hospitalData) ? hospitalData : [])
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to load emergency data'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    let socket

    try {
      // Use the existing socket client if this project exports one.
      // Polling below remains the fallback.
      const socketModule = require('../../services/socket')
      socket = socketModule.default || socketModule.socket

      if (socket?.on) {
        const refresh = () => loadData(false)

        socket.on('new_emergency', refresh)
        socket.on('emergency_updated', refresh)
        socket.on('ambulance_location', refresh)

        socket.__kavachEmergencyRefresh = refresh
      }
    } catch {
      // Socket module may have a different name or export.
    }

    const interval = window.setInterval(() => loadData(false), 15000)

    return () => {
      window.clearInterval(interval)

      if (socket?.__kavachEmergencyRefresh) {
        socket.off?.('new_emergency', socket.__kavachEmergencyRefresh)
        socket.off?.('emergency_updated', socket.__kavachEmergencyRefresh)
        socket.off?.('ambulance_location', socket.__kavachEmergencyRefresh)
        delete socket.__kavachEmergencyRefresh
      }
    }
  }, [loadData])

  const updateForm = (key, value) => {
    setDispatchForm(previous => {
      const next = { ...previous, [key]: value }

      if (key === 'ambulanceId') {
        const ambulance = ambulances.find(
          item => String(item._id) === String(value)
        )

        next.driverId = getId(ambulance?.driver)
      }

      return next
    })
  }

  const openDispatch = emergency => {
    setSelected(emergency)

    setDispatchForm({
      ambulanceId: '',
      driverId: '',
      hospitalId: getId(emergency.assignedHospital)
    })
  }

  const handleDispatch = async event => {
    event.preventDefault()

    if (!selected) return

    if (!dispatchForm.ambulanceId) {
      toast.error('Please select an available ambulance')
      return
    }

    setSubmitting(true)

    try {
      await emergencyService.dispatch(selected._id, {
        ambulanceId: dispatchForm.ambulanceId,
        driverId: dispatchForm.driverId || undefined,
        hospitalId: dispatchForm.hospitalId || undefined
      })

      toast.success('Ambulance dispatched successfully')
      setSelected(null)
      await loadData(false)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to dispatch ambulance'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async (emergency, status) => {
    try {
      await emergencyService.updateStatus(emergency._id, status)

      toast.success(`Status updated to ${STATUS_LABELS[status]}`)
      await loadData(false)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to update status'
      )
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400'

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader />
      </div>
    )
  }

  const activeCount = emergencies.filter(
    emergency =>
      !['resolved', 'cancelled'].includes(emergency.status)
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Emergency Requests
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor emergencies and coordinate ambulance dispatch.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          loading={refreshing}
          onClick={() => loadData(false)}
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<FiAlertCircle />}
          label="Total Requests"
          value={emergencies.length}
        />
        <SummaryCard
          icon={<FiActivity />}
          label="Active Emergencies"
          value={activeCount}
        />
        <SummaryCard
          icon={<FiTruck />}
          label="Available Ambulances"
          value={ambulances.length}
        />
      </div>

      {emergencies.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <FiCheckCircle className="mx-auto mb-3 text-4xl text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            No emergency requests
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            New emergency requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {emergencies.map(emergency => {
            const status = emergency.status || 'pending'
            const allowedStatuses = STATUS_OPTIONS[status] || []

            const coordinates = emergency.location?.coordinates
            const validCoordinates =
              Array.isArray(coordinates) &&
              coordinates.length === 2 &&
              Number.isFinite(Number(coordinates[0])) &&
              Number.isFinite(Number(coordinates[1]))

            const mapUrl = validCoordinates
              ? `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`
              : ''

            return (
              <motion.article
                key={emergency._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold capitalize text-white">
                        {(emergency.type || 'other').replaceAll('_', ' ')}
                      </h2>

                      <span
                        className={`rounded-lg border px-2 py-1 text-xs font-bold capitalize ${
                          SEVERITY_COLORS[emergency.severity] ||
                          SEVERITY_COLORS.high
                        }`}
                      >
                        {emergency.severity || 'high'}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Request ID: {emergency._id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      <FiClock className="mr-1 inline" />
                      {formatDate(emergency.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold ${
                      STATUS_COLORS[status] || 'text-white'
                    }`}
                  >
                    {STATUS_LABELS[status] || status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoRow
                    icon={<FiUser />}
                    label="Citizen"
                    value={
                      emergency.citizen?.name ||
                      'Citizen information unavailable'
                    }
                  />

                  <InfoRow
                    icon={<FiMapPin />}
                    label="Address"
                    value={
                      emergency.location?.address ||
                      'Address not provided'
                    }
                  />

                  <InfoRow
                    icon={<FiTruck />}
                    label="Assigned Ambulance"
                    value={
                      emergency.assignedAmbulance?.vehicleNumber ||
                      'Not assigned'
                    }
                  />

                  <InfoRow
                    icon={<FiUser />}
                    label="Assigned Driver"
                    value={
                      emergency.assignedDriver?.name ||
                      'Not assigned'
                    }
                  />

                  <InfoRow
                    icon={<FiActivity />}
                    label="Hospital"
                    value={
                      emergency.assignedHospital?.name ||
                      'Not assigned'
                    }
                  />
                </div>

                {emergency.description && (
                  <p className="mt-4 rounded-xl bg-slate-950/70 p-3 text-sm text-slate-300">
                    {emergency.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-cyan-400 hover:bg-slate-800"
                    >
                      <FiMapPin />
                      View Location
                      <FiExternalLink />
                    </a>
                  )}

                  {status === 'pending' && (
                    <Button
                      type="button"
                      onClick={() => openDispatch(emergency)}
                    >
                      <FiTruck className="mr-2" />
                      Dispatch Ambulance
                    </Button>
                  )}

                  {allowedStatuses.map(nextStatus => {
                    if (nextStatus === 'dispatched') return null

                    return (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(emergency, nextStatus)
                        }
                        className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-500 hover:bg-slate-800"
                      >
                        Mark {STATUS_LABELS[nextStatus]}
                      </button>
                    )
                  })}
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !submitting) {
              setSelected(null)
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6"
          >
            <h2 className="text-xl font-black text-white">
              Dispatch Ambulance
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Select the ambulance and destination hospital.
            </p>

            <form onSubmit={handleDispatch} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Available Ambulance *
                </label>

                <select
                  required
                  value={dispatchForm.ambulanceId}
                  onChange={event =>
                    updateForm('ambulanceId', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select ambulance</option>

                  {ambulances.map(ambulance => (
                    <option key={ambulance._id} value={ambulance._id}>
                      {ambulance.vehicleNumber}
                      {ambulance.driver?.name
                        ? ` — ${ambulance.driver.name}`
                        : ''}
                    </option>
                  ))}
                </select>

                {ambulances.length === 0 && (
                  <p className="mt-2 text-xs text-yellow-400">
                    No available ambulances. Add or release an ambulance first.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Assigned Driver
                </label>

                <input
                  readOnly
                  value={
                    ambulances.find(
                      ambulance =>
                        String(ambulance._id) ===
                        String(dispatchForm.ambulanceId)
                    )?.driver?.name || 'No driver assigned to this ambulance'
                  }
                  className={`${inputClass} opacity-80`}
                />

                <p className="mt-1 text-xs text-slate-500">
                  The driver assigned to the selected ambulance will be used.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Destination Hospital
                </label>

                <select
                  value={dispatchForm.hospitalId}
                  onChange={event =>
                    updateForm('hospitalId', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select hospital (optional)</option>

                  {hospitals.map(hospital => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name}
                      {hospital.address ? ` — ${hospital.address}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelected(null)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={submitting}
                  disabled={
                    submitting ||
                    !dispatchForm.ambulanceId ||
                    ambulances.length === 0
                  }
                  className="flex-1"
                >
                  Confirm Dispatch
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="text-xl text-cyan-400">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-950/50 p-3">
      <span className="mt-0.5 text-cyan-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="break-words text-sm text-slate-200">{value}</p>
      </div>
    </div>
  )
}
