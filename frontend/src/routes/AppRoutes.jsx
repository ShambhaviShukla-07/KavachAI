import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import Landing from '../pages/public/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import CitizenDashboard from '../pages/citizen/CitizenDashboard'
import RequestAmbulance from '../pages/citizen/RequestAmbulance'
import EmergencyHistory from '../pages/citizen/EmergencyHistory'
import WomenSafety from '../pages/citizen/WomenSafety'

import DispatcherDashboard from '../pages/dispatcher/DispatcherDashboard'
import EmergencyRequests from '../pages/dispatcher/EmergencyRequests'
import AmbulanceManagement from '../pages/dispatcher/AmbulanceManagement'
import LiveTracking from '../pages/dispatcher/LiveTracking'

import DriverDashboard from '../pages/driver/DriverDashboard'
import ActiveEmergency from '../pages/driver/ActiveEmergency'
import TripHistory from '../pages/driver/TripHistory'

import HospitalDashboard from '../pages/hospital/HospitalDashboard'
import EmergencyAdmissions from '../pages/hospital/EmergencyAdmissions'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Citizen */}
        <Route path="/citizen/dashboard" element={<RoleRoute roles={['citizen']}><CitizenDashboard /></RoleRoute>} />
        <Route path="/citizen/request" element={<RoleRoute roles={['citizen']}><RequestAmbulance /></RoleRoute>} />
        <Route path="/citizen/history" element={<RoleRoute roles={['citizen']}><EmergencyHistory /></RoleRoute>} />
        <Route path="/citizen/women-safety" element={<RoleRoute roles={['citizen']}><WomenSafety /></RoleRoute>} />

        {/* Dispatcher */}
        <Route path="/dispatcher/dashboard" element={<RoleRoute roles={['dispatcher']}><DispatcherDashboard /></RoleRoute>} />
        <Route path="/dispatcher/emergencies" element={<RoleRoute roles={['dispatcher']}><EmergencyRequests /></RoleRoute>} />
        <Route path="/dispatcher/ambulances" element={<RoleRoute roles={['dispatcher']}><AmbulanceManagement /></RoleRoute>} />
        <Route path="/dispatcher/tracking" element={<RoleRoute roles={['dispatcher']}><LiveTracking /></RoleRoute>} />

        {/* Driver */}
        <Route path="/driver/dashboard" element={<RoleRoute roles={['driver']}><DriverDashboard /></RoleRoute>} />
        <Route path="/driver/active" element={<RoleRoute roles={['driver']}><ActiveEmergency /></RoleRoute>} />
        <Route path="/driver/history" element={<RoleRoute roles={['driver']}><TripHistory /></RoleRoute>} />

        {/* Hospital */}
        <Route path="/hospital/dashboard" element={<RoleRoute roles={['hospital_admin']}><HospitalDashboard /></RoleRoute>} />
        <Route path="/hospital/admissions" element={<RoleRoute roles={['hospital_admin']}><EmergencyAdmissions /></RoleRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
