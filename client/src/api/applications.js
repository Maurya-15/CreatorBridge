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

export const apply = (campaignId) => API.post('/api/applications', { campaignId });
export const getCampaignApplications = (campaignId) =>
  API.get(`/api/applications/campaign/${campaignId}`);
export const getMyApplications = () => API.get('/api/applications/influencer/mine');
export const updateStatus = (id, status) =>
  API.put(`/api/applications/${id}/status`, { status });
