const mongoose = require('mongoose')

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['available', 'dispatched', 'en_route', 'at_scene', 'returning', 'maintenance'],
    default: 'available'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  fuelLevel: { type: Number, default: 100, min: 0, max: 100 },
  healthScore: { type: Number, default: 100, min: 0, max: 100 },
  currentEmergency: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency', default: null },
  totalTrips: { type: Number, default: 0 }
}, { timestamps: true })

ambulanceSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Ambulance', ambulanceSchema)
