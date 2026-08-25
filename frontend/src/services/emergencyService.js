import api from './api'

export const emergencyService = {
  create: (data) => api.post('/emergency', data),
  getAll: () => api.get('/emergency'),
  getById: (id) => api.get(`/emergency/${id}`),
  dispatch: (id, data) => api.put(`/emergency/${id}/dispatch`, data),
  updateStatus: (id, status) => api.put(`/emergency/${id}/status`, { status }),
  getStats: () => api.get('/emergency/stats')
}
