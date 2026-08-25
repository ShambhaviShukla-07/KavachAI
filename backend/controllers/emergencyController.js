const Emergency = require('../models/Emergency')
const Ambulance = require('../models/Ambulance')
const Notification = require('../models/Notification')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

// POST /api/emergency — citizen creates emergency
const createEmergency = asyncHandler(async (req, res) => {
  const { type, severity, description, coordinates, address } = req.body
  if (!coordinates) throw new ApiError(400, 'Location coordinates required')

  const emergency = await Emergency.create({
    citizen: req.user._id,
    type,
    severity: severity || 'high',
    description,
    location: { type: 'Point', coordinates, address }
  })

  // Notify all dispatchers via socket
  try {
    const { getIO } = require('../config/socket')
    getIO().emit('new_emergency', emergency)
  } catch (e) {}

  res.status(201).json(new ApiResponse(201, emergency, 'Emergency created'))
})

// GET /api/emergency — get all (dispatcher/admin) or own (citizen)
const getEmergencies = asyncHandler(async (req, res) => {
  let query = {}
  if (req.user.role === 'citizen') query.citizen = req.user._id
  if (req.user.role === 'driver') query.assignedDriver = req.user._id

  const emergencies = await Emergency.find(query)
    .populate('citizen', 'name phone')
    .populate('assignedAmbulance', 'vehicleNumber')
    .populate('assignedDriver', 'name phone')
    .populate('assignedHospital', 'name address')
    .sort({ createdAt: -1 })

  res.json(new ApiResponse(200, emergencies))
})

// GET /api/emergency/:id
const getEmergencyById = asyncHandler(async (req, res) => {
  const emergency = await Emergency.findById(req.params.id)
    .populate('citizen', 'name phone email')
    .populate('assignedAmbulance')
    .populate('assignedDriver', 'name phone')
    .populate('assignedHospital', 'name address phone')

  if (!emergency) throw new ApiError(404, 'Emergency not found')
  res.json(new ApiResponse(200, emergency))
})

// PUT /api/emergency/:id/dispatch — dispatcher assigns ambulance
const dispatchEmergency = asyncHandler(async (req, res) => {
  const { ambulanceId, hospitalId, driverId } = req.body

  const emergency = await Emergency.findById(req.params.id)
  if (!emergency) throw new ApiError(404, 'Emergency not found')

  emergency.status = 'dispatched'
  emergency.assignedAmbulance = ambulanceId || null
  emergency.assignedDriver = driverId || null
  emergency.assignedHospital = hospitalId || null
  emergency.dispatcher = req.user._id
  await emergency.save()

  if (ambulanceId) {
    await Ambulance.findByIdAndUpdate(ambulanceId, {
      status: 'dispatched',
      currentEmergency: emergency._id
    })
  }

  try {
    const { getIO } = require('../config/socket')
    getIO().emit('emergency_updated', emergency)
  } catch (e) {}

  res.json(new ApiResponse(200, emergency, 'Emergency dispatched'))
})

// PUT /api/emergency/:id/status — update status
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const emergency = await Emergency.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === 'resolved' ? { resolvedAt: new Date() } : {}) },
    { new: true }
  )
  if (!emergency) throw new ApiError(404, 'Emergency not found')

  if (status === 'resolved' && emergency.assignedAmbulance) {
    await Ambulance.findByIdAndUpdate(emergency.assignedAmbulance, {
      status: 'available',
      currentEmergency: null
    })
  }

  try {
    const { getIO } = require('../config/socket')
    getIO().emit('emergency_updated', emergency)
  } catch (e) {}

  res.json(new ApiResponse(200, emergency, 'Status updated'))
})

// GET /api/emergency/stats — analytics
const getStats = asyncHandler(async (req, res) => {
  const total = await Emergency.countDocuments()
  const pending = await Emergency.countDocuments({ status: 'pending' })
  const resolved = await Emergency.countDocuments({ status: 'resolved' })
  const active = await Emergency.countDocuments({ status: { $in: ['dispatched', 'en_route', 'arrived'] } })

  const byType = await Emergency.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ])

  res.json(new ApiResponse(200, { total, pending, resolved, active, byType }))
})

module.exports = { createEmergency, getEmergencies, getEmergencyById, dispatchEmergency, updateStatus, getStats }
