import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  update: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/vehicles/stats/summary');
    return response.data;
  }
};

// Sensors API
export const sensorsAPI = {
  getByVehicle: async (vehicleId, hours = 24) => {
    const response = await api.get(`/sensors/vehicle/${vehicleId}?hours=${hours}`);
    return response.data;
  },

  create: async (sensorData) => {
    const response = await api.post('/sensors', sensorData);
    return response.data;
  },

  getStats: async (vehicleId) => {
    const response = await api.get(`/sensors/stats/${vehicleId}`);
    return response.data;
  }
};

// Alerts API
export const alertsAPI = {
  getAll: async (limit = 50, unreadOnly = false) => {
    const response = await api.get(`/alerts?limit=${limit}&unreadOnly=${unreadOnly}`);
    return response.data;
  },

  getByVehicle: async (vehicleId) => {
    const response = await api.get(`/alerts/vehicle/${vehicleId}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/alerts/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/alerts/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/alerts/stats/count');
    return response.data;
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

export default api;