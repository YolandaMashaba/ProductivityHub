import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000', // Your backend URL
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Habits API calls
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  getOne: (id: string) => api.get(`/habits/${id}`),
  create: (habitData: { name: string; description?: string; frequency?: string; category?: string }) =>
    api.post('/habits', habitData),
  update: (id: string, habitData: any) =>
    api.patch(`/habits/${id}`, habitData),
  delete: (id: string) => api.delete(`/habits/${id}`),
  markComplete: (id: string) => api.post(`/habits/${id}/complete`),
};

// Tasks API calls (for later)
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (taskData: any) => api.post('/tasks', taskData),
  update: (id: string, taskData: any) => api.patch(`/tasks/${id}`, taskData),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Notes API calls (for later)
export const notesAPI = {
  getAll: () => api.get('/notes'),
  create: (noteData: any) => api.post('/notes', noteData),
  update: (id: string, noteData: any) => api.patch(`/notes/${id}`, noteData),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// Health check
export const healthCheck = () => api.get('/auth/health');

export default api;