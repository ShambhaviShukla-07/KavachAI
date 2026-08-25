const express = require('express')
const router = express.Router()
const {
  createEmergency, getEmergencies, getEmergencyById,
  dispatchEmergency, updateStatus, getStats
} = require('../controllers/emergencyController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

router.use(protect)
router.get('/stats', authorize('dispatcher'), getStats)
router.route('/').get(getEmergencies).post(createEmergency)
router.get('/:id', getEmergencyById)
router.put('/:id/dispatch', authorize('dispatcher'), dispatchEmergency)
router.put('/:id/status', updateStatus)

module.exports = router
