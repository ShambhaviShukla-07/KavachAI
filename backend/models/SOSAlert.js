const mongoose = require('mongoose')

const sosAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String, default: '' }
  },
  status: { type: String, enum: ['active', 'resolved', 'false_alarm'], default: 'active' },
  emergencyContacts: [{ name: String, phone: String }],
  linkedEmergency: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency', default: null },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true })

sosAlertSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('SOSAlert', sosAlertSchema)
