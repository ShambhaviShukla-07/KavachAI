const Ambulance = require('../models/Ambulance')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const getAmbulances = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find()
    .populate('driver', 'name phone')
    .populate('currentEmergency', 'type status location')
  res.json(new ApiResponse(200, ambulances))
})

const createAmbulance = asyncHandler(async (req, res) => {
  const ambulance = await Ambulance.create(req.body)
  res.status(201).json(new ApiResponse(201, ambulance, 'Ambulance added'))
})

const updateAmbulance = asyncHandler(async (req, res) => {
  const ambulance = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!ambulance) throw new ApiError(404, 'Ambulance not found')
  res.json(new ApiResponse(200, ambulance, 'Updated'))
})

const updateLocation = asyncHandler(async (req, res) => {
  const { coordinates } = req.body
  const ambulance = await Ambulance.findByIdAndUpdate(
    req.params.id,
    { location: { type: 'Point', coordinates } },
    { new: true }
  )
  try {
    const { getIO } = require('../config/socket')
    getIO().emit('ambulance_location', { id: ambulance._id, coordinates })
  } catch (e) {}
  res.json(new ApiResponse(200, ambulance))
})

const getAvailable = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find({ status: 'available' }).populate('driver', 'name phone')
  res.json(new ApiResponse(200, ambulances))
})

module.exports = { getAmbulances, createAmbulance, updateAmbulance, updateLocation, getAvailable }
