import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Use environment variable from app.json extra config, fallback to localhost for development
const API_BASE =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:3001/api";

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
    const res = await instance.post("/auth/register", {
      email,
      username: email.split("@")[0],
      password,
    });
    return res.data;
  },
  async login(email: string, password: string) {
    const res = await instance.post("/auth/login", { email, password });
    return res.data;
  },
  async createIdea(payload: any) {
    const res = await instance.post("/ideas", payload);
    return res.data;
  },
  async valuateIdea(id: string) {
    const res = await instance.post(`/ideas/${id}/valuate`);
    return res.data;
  },
};
