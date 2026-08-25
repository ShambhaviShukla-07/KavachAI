const ApiError = require('../utils/ApiError')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  if (err.name === 'CastError') error = new ApiError(400, 'Resource not found')
  if (err.code === 11000) error = new ApiError(400, 'Duplicate field value entered')
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(e => e.message).join(', ')
    error = new ApiError(400, msg)
  }
  if (err.name === 'JsonWebTokenError') error = new ApiError(401, 'Invalid token')
  if (err.name === 'TokenExpiredError') error = new ApiError(401, 'Token expired')

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  })
}

module.exports = errorHandler
