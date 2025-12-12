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

// Helper function to extract error messages from API errors
const extractErrorMessage = (error: any, defaultMessage: string): string => {
  return error?.response?.data?.error || error.message || defaultMessage;
};

export default {
  async register(email: string, password: string, userType?: string) {
    try {
      const res = await instance.post("/auth/register", {
        email,
        username: email.split("@")[0],
        password,
        userType: userType || "creator",
      });
      return res.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error: extractErrorMessage(error, 'Registration failed') };
    }
  },
  async login(email: string, password: string) {
    try {
      const res = await instance.post("/auth/login", { email, password });
      console.log('Login response:', res.data);
      return res.data || {};
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: extractErrorMessage(error, 'Login failed') };
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
    const res = await instance.get('/users/me');
    return res.data;
  },
  async updateProfile(data: any) {
    const res = await instance.patch('/users/me', data);
    return res.data;
  },
  async completeOnboarding(data: { type: 'collaborator-wizard' | 'creator-intro' }) {
    const res = await instance.post('/users/complete-onboarding', data);
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
