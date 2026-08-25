import api from './api'

export const hospitalService = {
  getAll: () => api.get('/hospital'),
  create: (data) => api.post('/hospital', data),
  update: (id, data) => api.put(`/hospital/${id}`, data),
  updateBeds: (id, availableBeds) => api.put(`/hospital/${id}/beds`, { availableBeds })
}
