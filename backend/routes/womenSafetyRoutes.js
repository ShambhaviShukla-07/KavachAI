const express = require('express')
const router = express.Router()
const { triggerSOS, getMySOS, resolveSOS, getAllSOS } = require('../controllers/womenSafetyController')
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')

router.use(protect)
router.post('/sos', triggerSOS)
router.get('/sos/my', getMySOS)
router.get('/sos/all', authorize('dispatcher'), getAllSOS)
router.put('/sos/:id/resolve', resolveSOS)

module.exports = router
