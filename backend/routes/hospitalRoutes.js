const express = require('express')
const router = express.Router()
const { getHospitals, createHospital, updateHospital, updateBeds } = require('../controllers/hospitalController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

router.use(protect)
router.route('/').get(getHospitals).post(authorize('dispatcher'), createHospital)
router.put('/:id', authorize('dispatcher', 'hospital_admin'), updateHospital)
router.put('/:id/beds', authorize('hospital_admin', 'dispatcher'), updateBeds)

module.exports = router
