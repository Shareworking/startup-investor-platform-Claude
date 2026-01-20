import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

export const startupAPI = {
  create: (data) => api.post('/api/startups', data),
  getAll: () => api.get('/api/startups'),
  getById: (id) => api.get(`/api/startups/${id}`),
  getMyStartups: () => api.get('/api/startups/my/startups'),
  update: (id, data) => api.put(`/api/startups/${id}`, data),
  delete: (id) => api.delete(`/api/startups/${id}`),
  addCoFounder: (id, data) => api.post(`/api/startups/${id}/cofounders`, data),
  removeCoFounder: (id, userId) => api.delete(`/api/startups/${id}/cofounders/${userId}`),
};

export default api;
