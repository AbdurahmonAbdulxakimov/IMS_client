import axios from 'axios';
import type { LoginCredentials, AuthTokens } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle 401 unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          storage.clear();
          window.location.href = '/login';
        }
      } else {
        storage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    axios.post<AuthTokens>(`${API_BASE_URL}/auth/token/`, credentials),
  getCurrentUser: () => api.get('/auth/users/me/'),
};

export const clientsAPI = {
  getAll: () => api.get('/clients/clients/'),
  getOne: (uuid: string) => api.get(`/clients/clients/${uuid}/`),
  create: (data: any) => api.post('/clients/clients/', data),
  update: (uuid: string, data: any) => api.put(`/clients/clients/${uuid}/`, data),
  delete: (uuid: string) => api.delete(`/clients/clients/${uuid}/`),
};

export const warehousesAPI = {
  getAll: (params?: any) => api.get('/inventory/warehouses/', { params }),
  create: (data: any) => api.post('/inventory/warehouses/', data),
  update: (data: any) => api.put('/inventory/warehouses/', data),
  delete: () => api.delete('/inventory/warehouses/'),
};

export const productsAPI = {
  getAll: (params?: any) => api.get('/inventory/products/', { params }),
  create: (data: any) => api.post('/inventory/products/create/', data),
  update: (data: any) => api.put('/inventory/products/create/', data),
};

export const stocksAPI = {
  getAll: (params?: any) => api.get('/inventory/stocks/', { params }),
  create: (data: any) => api.post('/inventory/stocks/create/', data),
  update: (data: any) => api.put('/inventory/stocks/create/', data),
};

export const transactionsAPI = {
  getAll: (params?: any) => api.get('/inventory/transactions/', { params }),
  create: (data: any) => api.post('/inventory/transactions/create/', data),
};

export const categoriesAPI = {
  getAll: (params?: any) => api.get('/inventory/product-categories/', { params }),
  create: (data: any) => api.post('/inventory/product-categories/', data),
  update: (data: any) => api.put('/inventory/product-categories/', data),
};

export default api;
