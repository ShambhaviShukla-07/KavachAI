const SOSAlert = require('../models/SOSAlert')
const Emergency = require('../models/Emergency')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const triggerSOS = asyncHandler(async (req, res) => {
  const { coordinates, address, emergencyContacts } = req.body
  if (!coordinates) throw new ApiError(400, 'Location required')

  const sos = await SOSAlert.create({
    user: req.user._id,
    location: { type: 'Point', coordinates, address },
    emergencyContacts: emergencyContacts || []
  })

  // Auto-create emergency
  const emergency = await Emergency.create({
    citizen: req.user._id,
    type: 'women_sos',
    severity: 'critical',
    description: 'Women SOS Alert triggered',
    location: { type: 'Point', coordinates, address }
  })

  sos.linkedEmergency = emergency._id
  await sos.save()

  try {
    const { getIO } = require('../config/socket')
    getIO().emit('new_sos', { sos, emergency })
  } catch (e) {}

  res.status(201).json(new ApiResponse(201, { sos, emergency }, 'SOS Alert triggered'))
})

const getMySOS = asyncHandler(async (req, res) => {
  const alerts = await SOSAlert.find({ user: req.user._id })
    .populate('linkedEmergency')
    .sort({ createdAt: -1 })
  res.json(new ApiResponse(200, alerts))
})

const resolveSOS = asyncHandler(async (req, res) => {
  const sos = await SOSAlert.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved', resolvedAt: new Date() },
    { new: true }
  )
  if (!sos) throw new ApiError(404, 'SOS not found')
  res.json(new ApiResponse(200, sos, 'SOS resolved'))
})

const getAllSOS = asyncHandler(async (req, res) => {
  const alerts = await SOSAlert.find()
    .populate('user', 'name phone')
    .populate('linkedEmergency')
    .sort({ createdAt: -1 })
  res.json(new ApiResponse(200, alerts))
})

module.exports = { triggerSOS, getMySOS, resolveSOS, getAllSOS }
