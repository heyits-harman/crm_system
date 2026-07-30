import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-system-rv6p.onrender.com';

// Authenticated API instance (attaches JWT token)
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/users/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem('crm_token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/submit') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Public API instance — no auth interceptors, used for unauthenticated routes
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // Render free tier can be slow to wake up
});

export default api;

