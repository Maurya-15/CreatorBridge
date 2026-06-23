import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('creatorbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProfile = (userId) => API.get(`/api/profile/${userId}`);
export const createProfile = (data) => API.post('/api/profile', data);
export const updateProfile = (data) => API.put('/api/profile', data);
