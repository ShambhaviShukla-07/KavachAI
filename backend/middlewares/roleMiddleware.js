const ApiError = require('../utils/ApiError')

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not authorized`)
  }
  next()
}

module.exports = { authorize }
