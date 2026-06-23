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

export const getAllCampaigns = () => API.get('/api/campaigns');
export const createCampaign = (data) => API.post('/api/campaigns', data);
export const getMyCampaigns = () => API.get('/api/campaigns/brand/mine');
export const getCampaign = (id) => API.get(`/api/campaigns/${id}`);
export const updateCampaignBrandInstagram = (id, brandInstagramUrl) =>
  API.put(`/api/campaigns/${id}/brand-instagram`, { brandInstagramUrl });
