import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('credence_user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('credence_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getAllUsers: () => api.get('/auth/users'),
};

// Packages API
export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getBySlug: (slug) => api.get(`/packages/${slug}`),
  create: (data) => api.post('/packages', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/packages/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/packages/${id}`),
  getStats: () => api.get('/packages/stats'),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getByRef: (ref) => api.get(`/bookings/ref/${ref}`),
  getAll: (params) => api.get('/bookings', { params }),
  updateStatus: (id, data) => api.put(`/bookings/${id}`, data),
};

// Destinations API
export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getBySlug: (slug) => api.get(`/destinations/${slug}`),
  create: (data) => api.post('/destinations', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/destinations/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/destinations/${id}`),
};

// Testimonials API
export const testimonialsAPI = {
  getApproved: () => api.get('/testimonials'),
  submit: (data) => api.post('/testimonials', data),
  getAll: () => api.get('/testimonials/all'),
  approve: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getMessages: () => api.get('/contact'),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter', data),
  getSubscribers: () => api.get('/newsletter'),
  unsubscribe: (data) => api.post('/newsletter/unsubscribe', data),
};

export default api;
