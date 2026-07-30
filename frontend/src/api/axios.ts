import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite dev server proxy (/users, /leads, /dashboard)
  headers: {
    'Content-Type': 'application/json',
  },
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
      // Don't auto logout if trying to login or public actions
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

export default api;
