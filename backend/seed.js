require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Ambulance = require('./models/Ambulance')
const Hospital = require('./models/Hospital')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear existing
  await User.deleteMany({})
  await Ambulance.deleteMany({})
  await Hospital.deleteMany({})
  console.log('Cleared existing data')

  // Create users
  const users = await User.create([
    { name: 'Priya Citizen', email: 'citizen@demo.com', password: 'demo123', phone: '9876543210', role: 'citizen' },
    { name: 'Raj Dispatcher', email: 'dispatcher@demo.com', password: 'demo123', phone: '9876543211', role: 'dispatcher' },
    { name: 'Amit Driver', email: 'driver@demo.com', password: 'demo123', phone: '9876543212', role: 'driver' },
    { name: 'Dr. Sharma', email: 'hospital@demo.com', password: 'demo123', phone: '9876543213', role: 'hospital_admin' }
  ])
  console.log('Created demo users')

  const driver = users.find(u => u.role === 'driver')

  // Create ambulances
  await Ambulance.create([
    { vehicleNumber: 'MH-01-KA-001', driver: driver._id, status: 'available', fuelLevel: 95, healthScore: 98 },
    { vehicleNumber: 'MH-01-KA-002', status: 'available', fuelLevel: 80, healthScore: 90 },
    { vehicleNumber: 'MH-01-KA-003', status: 'available', fuelLevel: 70, healthScore: 85 },
    { vehicleNumber: 'MH-01-KA-004', status: 'maintenance', fuelLevel: 30, healthScore: 45 }
  ])
  console.log('Created ambulances')

  // Create hospitals
  const hospitalAdmin = users.find(u => u.role === 'hospital_admin')
  await Hospital.create([
    { name: 'City General Hospital', admin: hospitalAdmin._id, address: 'MG Road, Mumbai', phone: '022-12345678', location: { type: 'Point', coordinates: [72.8777, 19.0760] }, totalBeds: 50, availableBeds: 12, specializations: ['Trauma', 'Cardiology'] },
    { name: 'Apollo Emergency Center', address: 'Bandra West, Mumbai', phone: '022-87654321', location: { type: 'Point', coordinates: [72.8347, 19.0596] }, totalBeds: 30, availableBeds: 4, specializations: ['Neurology', 'Orthopedics'] },
    { name: 'Metro Trauma Hospital', address: 'Andheri East, Mumbai', phone: '022-11223344', location: { type: 'Point', coordinates: [72.8697, 19.1136] }, totalBeds: 40, availableBeds: 0, specializations: ['Burns', 'Trauma'] }
  ])
  console.log('Created hospitals')

  console.log('\n✅ Seed complete!')
  console.log('Demo accounts:')
  console.log('  Citizen:    citizen@demo.com    / demo123')
  console.log('  Dispatcher: dispatcher@demo.com / demo123')
  console.log('  Driver:     driver@demo.com     / demo123')
  console.log('  Hospital:   hospital@demo.com   / demo123')

  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
