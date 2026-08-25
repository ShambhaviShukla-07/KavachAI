const Hospital = require('../models/Hospital')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({ isActive: true })
  res.json(new ApiResponse(200, hospitals))
})

const createHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.create(req.body)
  res.status(201).json(new ApiResponse(201, hospital, 'Hospital added'))
})

const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!hospital) throw new ApiError(404, 'Hospital not found')
  res.json(new ApiResponse(200, hospital, 'Updated'))
})

const updateBeds = asyncHandler(async (req, res) => {
  const { availableBeds } = req.body
  const hospital = await Hospital.findByIdAndUpdate(
    req.params.id,
    { availableBeds },
    { new: true }
  )
  res.json(new ApiResponse(200, hospital, 'Bed count updated'))
})

module.exports = { getHospitals, createHospital, updateHospital, updateBeds }
