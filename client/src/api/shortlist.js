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

export const addToShortlist = (influencerId) =>
  API.post(`/api/shortlist/${influencerId}`);
export const removeFromShortlist = (influencerId) =>
  API.delete(`/api/shortlist/${influencerId}`);
export const getShortlist = () => API.get('/api/shortlist');
