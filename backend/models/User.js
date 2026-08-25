const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'dispatcher', 'driver', 'hospital_admin'],
    default: 'citizen'
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true })

userSchema.index({ location: '2dsphere' })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
