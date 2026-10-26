
import api from './api'

export const womenSafetyService = {
  triggerSOS: (data) => api.post('/women-safety/sos', data),

  getMySOS: () => api.get('/women-safety/sos/my'),

  getAllSOS: () => api.get('/women-safety/sos/all'),

  resolveSOS: (id) => api.put(`/women-safety/sos/${id}/resolve`),

  getEmergencyContacts: () => api.get('/women-safety/contacts'),

  saveEmergencyContacts: (emergencyContacts) =>
    api.put('/women-safety/contacts', { emergencyContacts })
}
