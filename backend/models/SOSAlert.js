const mongoose = require('mongoose')

const sosAlertSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
index: true
},

location: {
type: {
type: String,
enum: ['Point'],
default: 'Point',
required: true
},

// GeoJSON coordinates: [longitude, latitude]
coordinates: {
  type: [Number],
  required: true,
  validate: {
    validator: function (coordinates) {
      return (
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        coordinates.every(Number.isFinite) &&
        coordinates[0] >= -180 &&
        coordinates[0] <= 180 &&
        coordinates[1] >= -90 &&
        coordinates[1] <= 90
      )
    },
    message: 'Valid [longitude, latitude] coordinates are required'
  }
},

address: {
  type: String,
  default: ''
},

mapsUrl: {
  type: String,
  default: ''
},

accuracy: {
  type: Number,
  default: null
},

locationTimestamp: {
  type: Date,
  default: null
}


},

status: {
type: String,
enum: ['active', 'resolved', 'false_alarm'],
default: 'active'
},

emergencyContacts: [{
name: {
type: String,
trim: true,
default: ''
},


phone: {
  type: String,
  trim: true,
  default: ''
},

email: {
  type: String,
  trim: true,
  lowercase: true,
  default: '',
  validate: {
    validator: function (value) {
      if (!value) return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    message: 'Please enter a valid emergency contact email'
  }
}


}],

linkedEmergency: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Emergency',
default: null
},

resolvedAt: {
type: Date,
default: null
}
}, {
timestamps: true
})

// Geospatial index for location-based searches
sosAlertSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('SOSAlert', sosAlertSchema)
