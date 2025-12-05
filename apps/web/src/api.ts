import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  async register(email: string, password: string) {
    const res = await instance.post('/auth/register', { email, username: email.split('@')[0], password });
    return res.data;
  },
  async login(email: string, password: string) {
    try {
      const res = await instance.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      return res.data || {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: error.message || 'Login failed' };
    }
  },
  async createIdea(payload: any) {
    const res = await instance.post('/ideas', payload);
    return res.data;
  },
  async valuateIdea(id: string) {
    const res = await instance.post(`/ideas/${id}/valuate`);
    return res.data;
  },
  async listMarketplace(q?: string) {
    const res = await instance.get('/marketplace', { params: { q } });
    return res.data;
  },
  async searchCollaborators(q?: string, skill?: string) {
    const res = await instance.get('/collaborators', { params: { q, skill } });
    return res.data;
  },
};
