const mongoose = require('mongoose')

const emergencySchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['medical', 'accident', 'fire', 'women_sos', 'other'],
    required: true
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  description: { type: String, default: '' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'en_route', 'arrived', 'resolved', 'cancelled'],
    default: 'pending'
  },
  assignedAmbulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', default: null },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  eta: { type: Number, default: null },
  resolvedAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true })

emergencySchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Emergency', emergencySchema)
