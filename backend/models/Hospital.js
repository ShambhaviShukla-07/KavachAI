const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  totalBeds: { type: Number, default: 50 },
  availableBeds: { type: Number, default: 50 },
  specializations: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

hospitalSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Hospital', hospitalSchema)
