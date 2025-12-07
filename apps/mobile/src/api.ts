import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./environment";

// API URL determined by environment.ts based on __DEV__ and env vars
const API_BASE = API_URL;

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  async register(email: string, password: string) {
    try {
      const res = await instance.post("/auth/register", {
        email,
        username: email.split("@")[0],
        password,
      });
      return res.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error?.response?.data?.error || error.message || 'Registration failed';
      return { error: errorMsg };
    }
  },
  async login(email: string, password: string) {
    try {
      const res = await instance.post("/auth/login", { email, password });
      console.log('Login response:', res.data);
      return res.data || {};
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error?.response?.data?.error || error.message || 'Login failed';
      return { error: errorMsg };
    }
  },
  async createIdea(payload: any) {
    const res = await instance.post("/ideas", payload);
    return res.data;
  },
  async valuateIdea(id: string) {
    const res = await instance.post(`/ideas/${id}/valuate`);
    return res.data;
  },
  async getIdeaDetail(id: string) {
    const res = await instance.get(`/ideas/${id}`);
    return res.data;
  },
  async searchCollaborators(q?: string, skill?: string) {
    const res = await instance.get('/collaborators', { params: { q, skill } });
    return res.data;
  },
  async getProfile() {
    const res = await instance.get('/collaborators/me');
    return res.data;
  },
  async createPaymentIntent(ideaId: string, amount: number) {
    const res = await instance.post('/payments/intent', { ideaId, amount });
    return res.data;
  },
  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    const res = await instance.post('/payments/confirm', { paymentIntentId, paymentMethodId });
    return res.data;
  },
};
