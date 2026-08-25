const express = require('express')
const router = express.Router()
const { getAmbulances, createAmbulance, updateAmbulance, updateLocation, getAvailable } = require('../controllers/ambulanceController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

router.use(protect)
router.get('/available', getAvailable)
router.route('/').get(getAmbulances).post(authorize('dispatcher'), createAmbulance)
router.put('/:id', authorize('dispatcher'), updateAmbulance)
router.put('/:id/location', updateLocation)

module.exports = router
