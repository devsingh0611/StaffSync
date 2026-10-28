import axios from 'axios';
import { handleMockRequest } from './mockHandler';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach JWT token
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

// Response interceptor with seamless cloud fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If real backend is not reachable or returns 404 on Vercel static hosting
    const isUnreachable =
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED';

    if (isUnreachable && error.config) {
      console.warn('[StaffSync]: Live backend API unreachable. Seamlessly activating built-in resilient data engine.');
      try {
        const fallbackRes = await handleMockRequest(error.config);
        return Promise.resolve(fallbackRes);
      } catch (fallbackErr) {
        return Promise.reject(error);
      }
    }

    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
