import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
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
    try {
      const res = await instance.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      return res.data || {};
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg =
        error?.response?.data?.error || error.message || "Login failed";
      return { error: errorMsg };
    }
  },
  async createIdea(payload: any) {
    const res = await instance.post("/ideas", payload);
    return res.data;
  },
  async listMarketplace(q?: string) {
    const res = await instance.get("/marketplace", { params: { q } });
    return res.data;
  },
  async searchCollaborators(q?: string, skill?: string) {
    const res = await instance.get("/collaborators", { params: { q, skill } });
    return res.data;
  },
  async inviteCollaborator(collaboratorId: string, ideaId: string) {
    const res = await instance.post("/collaborators/invite", {
      collaboratorId,
      ideaId,
    });
    return res.data;
  },
  async getProfile() {
    const res = await instance.get("/collaborators/me");
    return res.data;
  },
  async getIdeaDetail(id: string) {
    const res = await instance.get(`/ideas/${id}`);
    return res.data;
  },
  async createPaymentIntent(ideaId: string, amount: number) {
    const res = await instance.post("/payments/intent", { ideaId, amount });
    return res.data;
  },
  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    const res = await instance.post("/payments/confirm", {
      paymentIntentId,
      paymentMethodId,
    });
    return res.data;
  },
};
