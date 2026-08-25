const express = require('express')
const router = express.Router()
const { getMyNotifications, markRead } = require('../controllers/notificationController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)
router.get('/', getMyNotifications)
router.put('/read', markRead)

module.exports = router
