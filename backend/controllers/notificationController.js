const Notification = require('../models/Notification')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20)
  res.json(new ApiResponse(200, notifications))
})

const markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
  res.json(new ApiResponse(200, null, 'Marked as read'))
})

module.exports = { getMyNotifications, markRead }
