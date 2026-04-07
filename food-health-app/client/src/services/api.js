// src/services/api.js — Axios instance, no Firebase token
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Server runs with BYPASS_AUTH=true so any Bearer value is accepted
    Authorization: 'Bearer demo-token',
  },
});

// ─── Response interceptor — global error toast ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message || error.message || 'Something went wrong';
    if (error.response?.status !== 401) {
      toast.error(message, { duration: 4000 });
    }
    return Promise.reject(error);
  },
);

export default api;
