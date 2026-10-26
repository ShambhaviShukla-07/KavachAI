import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiTruck,
  FiPlus,
  FiRefreshCw,
  FiEdit2,
  FiActivity,
  FiDroplet,
  FiUser,
  FiX,
  FiMapPin,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { ambulanceService } from '../../services/ambulanceService'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'

const STATUSES = [
  'available',
  'dispatched',
  'en_route',
  'at_scene',
  'returning',
  'maintenance',
]

const EMPTY_FORM = {
  vehicleNumber: '',
  driver: '',
  status: 'available',
  fuelLevel: 100,
  healthScore: 100,
  latitude: '',
  longitude: '',
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 placeholder:text-slate-500'

function extractData(response) {
  const body = response?.data
  return body?.data ?? body
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong.'
  )
}

function getCoordinates(ambulance) {
  const coordinates = ambulance?.location?.coordinates

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return { latitude: '', longitude: '' }
  }

  const [longitude, latitude] = coordinates

  // Treat the default MongoDB coordinates as an unset location.
  if (longitude === 0 && latitude === 0) {
    return { latitude: '', longitude: '' }
  }

  return {
    latitude: String(latitude),
    longitude: String(longitude),
  }
}

function validateLocation(latitude, longitude) {
  const hasLatitude = String(latitude).trim() !== ''
  const hasLongitude = String(longitude).trim() !== ''

  if (!hasLatitude && !hasLongitude) {
    return { supplied: false }
  }

  if (!hasLatitude || !hasLongitude) {
    return {
      supplied: true,
      error: 'Please enter both latitude and longitude.',
    }
  }

  const lat = Number(latitude)
  const lng = Number(longitude)

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return {
      supplied: true,
      error: 'Latitude must be between -90 and 90.',
    }
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return {
      supplied: true,
      error: 'Longitude must be between -180 and 180.',
    }
  }

  if (lat === 0 && lng === 0) {
    return {
      supplied: true,
      error: 'Please enter the actual ambulance location, not 0, 0.',
    }
  }

  return {
    supplied: true,
    latitude: lat,
    longitude: lng,
  }
}

export default function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadAmbulances = useCallback(async (showLoader = false) => {
    if (showLoader) setRefreshing(true)

    try {
      const response = await ambulanceService.getAll()
      const result = extractData(response)

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.ambulances)
          ? result.ambulances
          : []

      setAmbulances(list)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadAmbulances()

    const interval = setInterval(() => {
      loadAmbulances()
    }, 20000)

    return () => clearInterval(interval)
  }, [loadAmbulances])

  const openAddModal = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setModalOpen(true)
  }

  const openEditModal = (ambulance) => {
    const location = getCoordinates(ambulance)

    setEditingId(ambulance._id || ambulance.id)

    setForm({
      vehicleNumber: ambulance.vehicleNumber || '',
      driver:
        typeof ambulance.driver === 'object'
          ? ambulance.driver?._id || ''
          : ambulance.driver || '',
      status: ambulance.status || 'available',
      fuelLevel: ambulance.fuelLevel ?? 100,
      healthScore: ambulance.healthScore ?? 100,
      latitude: location.latitude,
      longitude: location.longitude,
    })

    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const vehicleNumber = form.vehicleNumber.trim()

    if (!vehicleNumber) {
      toast.error('Vehicle number is required.')
      return
    }

    const fuelLevel = Number(form.fuelLevel)
    const healthScore = Number(form.healthScore)

    if (
      !Number.isFinite(fuelLevel) ||
      fuelLevel < 0 ||
      fuelLevel > 100
    ) {
      toast.error('Fuel level must be between 0 and 100.')
      return
    }

    if (
      !Number.isFinite(healthScore) ||
      healthScore < 0 ||
      healthScore > 100
    ) {
      toast.error('Health score must be between 0 and 100.')
      return
    }

    const locationValidation = validateLocation(
      form.latitude,
      form.longitude
    )

    if (locationValidation.error) {
      toast.error(locationValidation.error)
      return
    }

    const payload = {
      vehicleNumber,
      driver: form.driver.trim() || null,
      fuelLevel,
      healthScore,
    }

    if (editingId) {
      payload.status = form.status
    }

    setSaving(true)

    try {
      if (editingId) {
        await ambulanceService.update(editingId, payload)

        if (locationValidation.supplied) {
          await ambulanceService.updateLocation(editingId, [
            locationValidation.longitude,
            locationValidation.latitude,
          ])
        }

        toast.success(
          locationValidation.supplied
            ? 'Ambulance and location updated successfully.'
            : 'Ambulance updated successfully.'
        )

        setModalOpen(false)
        setEditingId(null)
        setForm({ ...EMPTY_FORM })

        await loadAmbulances()
      } else {
        const response = await ambulanceService.create(payload)
        const createdAmbulance = extractData(response)

        const createdId =
          createdAmbulance?._id ||
          createdAmbulance?.id ||
          createdAmbulance?.ambulance?._id

        if (locationValidation.supplied) {
          if (!createdId) {
            toast.error(
              'Ambulance added, but its ID could not be found to save the location.'
            )
          } else {
            try {
              await ambulanceService.updateLocation(createdId, [
                locationValidation.longitude,
                locationValidation.latitude,
              ])

              toast.success(
                'Ambulance added with location successfully.'
              )
            } catch {
              toast.error(
                'Ambulance added, but location was not saved. Edit the ambulance and try again.'
              )
            }
          }
        } else {
          toast.success('Ambulance added successfully.')
        }

        setModalOpen(false)
        setEditingId(null)
        setForm({ ...EMPTY_FORM })

        await loadAmbulances()
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  const availableCount = ambulances.filter(
    (ambulance) => ambulance.status === 'available'
  ).length

  const activeCount = ambulances.filter((ambulance) =>
    ['dispatched', 'en_route', 'at_scene', 'returning'].includes(
      ambulance.status
    )
  ).length

  const missingLocationCount = ambulances.filter((ambulance) => {
    const coordinates = ambulance.location?.coordinates

    return (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      coordinates[0] === 0 && coordinates[1] === 0
    )
  }).length

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Dispatcher Control
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Ambulance Management
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage vehicles, drivers, status and live locations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => loadAmbulances(true)}
            disabled={refreshing}
          >
            <FiRefreshCw
              className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <Button onClick={openAddModal}>
            <FiPlus className="mr-2" />
            Add Ambulance
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Ambulances"
          value={ambulances.length}
          icon={<FiTruck />}
          description="Registered vehicles"
        />

        <SummaryCard
          title="Available"
          value={availableCount}
          icon={<FiActivity />}
          description="Ready for dispatch"
        />

        <SummaryCard
          title="Active"
          value={activeCount}
          icon={<FiUser />}
          description="Currently on duty"
        />

        <SummaryCard
          title="Missing Location"
          value={missingLocationCount}
          icon={<FiMapPin />}
          description="Coordinates need updating"
        />
      </div>

      {/* Location warning */}
      {missingLocationCount > 0 && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <div className="flex items-start gap-3">
            <FiMapPin className="mt-1 shrink-0 text-xl text-amber-300" />

            <div>
              <h2 className="font-semibold text-amber-200">
                Ambulance location needs updating
              </h2>

              <p className="mt-1 text-sm text-amber-100/80">
                {missingLocationCount} ambulance(s) have default or missing
                coordinates. Select Edit Ambulance and enter the actual
                latitude and longitude to show their correct location on
                Live Tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ambulance cards */}
      {ambulances.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
          <FiTruck className="mx-auto text-4xl text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold">
            No ambulances registered
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Add an ambulance to start managing your fleet.
          </p>

          <div className="mt-5">
            <Button onClick={openAddModal}>
              <FiPlus className="mr-2" />
              Add First Ambulance
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {ambulances.map((ambulance, index) => {
            const id = ambulance._id || ambulance.id
            const coordinates = ambulance.location?.coordinates || []
            const hasLocation =
              coordinates.length === 2 &&
              !(coordinates[0] === 0 && coordinates[1] === 0)

            const driverName =
              typeof ambulance.driver === 'object'
                ? ambulance.driver?.name ||
                  ambulance.driver?.fullName ||
                  ambulance.driver?._id ||
                  'Not assigned'
                : ambulance.driver || 'Not assigned'

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-400/10 p-3 text-xl text-cyan-300">
                      <FiTruck />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">
                        {ambulance.vehicleNumber}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        ID: {id}
                      </p>
                    </div>
                  </div>

                  <StatusPill status={ambulance.status} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MetricBar
                    icon={<FiDroplet />}
                    label="Fuel Level"
                    value={ambulance.fuelLevel ?? 0}
                    suffix="%"
                  />

                  <MetricBar
                    icon={<FiActivity />}
                    label="Health Score"
                    value={ambulance.healthScore ?? 0}
                    suffix="%"
                  />
                </div>

                <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  <InfoRow
                    icon={<FiUser />}
                    label="Driver"
                    value={driverName}
                  />

                  <InfoRow
                    icon={<FiMapPin />}
                    label="Location"
                    value={
                      hasLocation
                        ? `${coordinates[1]}, ${coordinates[0]}`
                        : 'Not configured (0, 0)'
                    }
                  />

                  {hasLocation && (
                    <a
                      href={`https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                    >
                      <FiMapPin />
                      View on Google Maps
                    </a>
                  )}

                  {ambulance.currentEmergency && (
                    <InfoRow
                      icon={<FiActivity />}
                      label="Current Emergency"
                      value={
                        typeof ambulance.currentEmergency === 'object'
                          ? ambulance.currentEmergency._id
                          : ambulance.currentEmergency
                      }
                    />
                  )}
                </div>

                <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                  <Button onClick={() => openEditModal(ambulance)}>
                    <FiEdit2 className="mr-2" />
                    Edit Ambulance
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Ambulance' : 'Add Ambulance'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Enter vehicle details and location coordinates.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Vehicle Number *">
                  <input
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. UP32 AB 1234"
                    required
                  />
                </FormField>

                <FormField label="Driver ID (optional)">
                  <input
                    name="driver"
                    value={form.driver}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter driver's MongoDB ID"
                  />
                </FormField>

                <FormField label="Fuel Level (%)">
                  <input
                    type="number"
                    name="fuelLevel"
                    value={form.fuelLevel}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                    max="100"
                    required
                  />
                </FormField>

                <FormField label="Health Score (%)">
                  <input
                    type="number"
                    name="healthScore"
                    value={form.healthScore}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                    max="100"
                    required
                  />
                </FormField>

                {editingId && (
                  <FormField label="Ambulance Status">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </FormField>
                )}
              </div>

              {/* Location fields */}
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                    <FiMapPin className="text-xl" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Ambulance Location
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Enter the actual ambulance coordinates. Leave both
                      fields empty if you do not want to change the saved
                      location.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Latitude">
                    <input
                      type="number"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. 26.8467"
                      min="-90"
                      max="90"
                      step="any"
                    />
                  </FormField>

                  <FormField label="Longitude">
                    <input
                      type="number"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. 80.9462"
                      min="-180"
                      max="180"
                      step="any"
                    />
                  </FormField>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Note: Latitude and longitude are different. Use the
                  ambulance's real location, not your laptop's location.
                  Coordinates (0, 0) are treated as unset.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Save Changes'
                      : 'Add Ambulance'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ title, value, icon, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div className="rounded-xl bg-cyan-400/10 p-3 text-xl text-cyan-300">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  )
}

function StatusPill({ status }) {
  const styles = {
    available: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    dispatched: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    en_route: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
    at_scene: 'bg-violet-400/10 text-violet-300 border-violet-400/20',
    returning: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
    maintenance: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
  }

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
        styles[status] ||
        'border-white/10 bg-white/5 text-slate-300'
      }`}
    >
      {(status || 'unknown').replaceAll('_', ' ').toUpperCase()}
    </span>
  )
}

function MetricBar({ icon, label, value, suffix }) {
  const numericValue = Number(value)
  const safeValue = Number.isFinite(numericValue)
    ? Math.min(100, Math.max(0, numericValue))
    : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 text-slate-400">
          {icon}
          {label}
        </span>

        <span className="font-semibold text-white">
          {safeValue}
          {suffix}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 text-slate-400">{icon}</span>

      <span className="w-32 shrink-0 text-slate-400">{label}</span>

      <span className="min-w-0 break-all text-slate-200">
        {value || '—'}
      </span>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>

      {children}
    </label>
  )
}