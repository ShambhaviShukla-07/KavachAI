const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body
  if (!name || !email || !password || !phone) throw new ApiError(400, 'All fields required')

  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(400, 'Email already registered')

  const user = await User.create({ name, email, password, phone, role: role || 'citizen' })
  const token = generateToken(user._id)

  res.status(201).json(new ApiResponse(201, { user, token }, 'Registered successfully'))
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Email and password required')

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const token = generateToken(user._id)
  user.password = undefined

  res.json(new ApiResponse(200, { user, token }, 'Login successful'))
})

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user))
})

// PUT /api/auth/update-profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  )
  res.json(new ApiResponse(200, user, 'Profile updated'))
})

module.exports = { register, login, getMe, updateProfile }
