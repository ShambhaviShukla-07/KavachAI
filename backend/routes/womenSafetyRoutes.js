const express = require('express')
const router = express.Router()

const {
triggerSOS,
getMySOS,
resolveSOS,
getAllSOS,
saveEmergencyContacts,
getEmergencyContacts
} = require('../controllers/womenSafetyController')

const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

// All routes require authentication
router.use(protect)

// Get and save emergency contacts
router.get('/contacts', getEmergencyContacts)
router.put('/contacts', saveEmergencyContacts)

// Trigger a new SOS alert
router.post('/sos', triggerSOS)

// Get the logged-in user's SOS history
router.get('/sos/my', getMySOS)

// Dispatcher-only: view all SOS alerts
router.get('/sos/all', authorize('dispatcher'), getAllSOS)

// Resolve an alert; controller must verify ownership/role
router.put('/sos/:id/resolve', resolveSOS)

module.exports = router
