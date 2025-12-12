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
      console.error("Register error:", error);
      const errorMsg =
        error?.response?.data?.error || error.message || "Registration failed";
      return { error: errorMsg };
    }
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
  async getIdeaDetail(id: string) {
    const res = await instance.get(`/ideas/${id}`);
    return res.data;
  },
  async valuateIdea(id: string) {
    const res = await instance.post(`/ideas/${id}/valuate`);
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
  async getNotifications() {
    const res = await instance.get("/notifications");
    return res.data;
  },
  async markNotificationRead(id: string) {
    const res = await instance.patch(`/notifications/${id}/read`);
    return res.data;
  },
  async markAllNotificationsRead() {
    const res = await instance.patch("/notifications", { markAll: true });
    return res.data;
  },
  async deleteNotification(id: string) {
    const res = await instance.delete(`/notifications/${id}`);
    return res.data;
  },
  // Direct messages
  async sendDirectMessage(toUserId: string, content: string) {
    const res = await instance.post("/messages", {
      threadType: "dm",
      toUserId,
      content,
    });
    return res.data;
  },
  async getDirectMessages(userId: string) {
    const res = await instance.get(`/messages/direct/${userId}`);
    return res.data;
  },
  async getConversations() {
    const res = await instance.get("/messages/conversations");
    return res.data;
  },
  // Idea discussions
  async sendIdeaMessage(ideaId: string, content: string, parentId?: string) {
    const res = await instance.post("/messages", {
      threadType: "idea",
      ideaId,
      content,
      parentId,
    });
    return res.data;
  },
  async getIdeaMessages(ideaId: string) {
    const res = await instance.get(`/ideas/${ideaId}/messages`);
    return res.data;
  },
  // Collaboration invitations
  async inviteCollaborator(collaboratorId: string, ideaId: string, role?: string, message?: string) {
    const res = await instance.post("/collaborators/invite", {
      collaboratorId,
      ideaId,
      role,
      message,
    });
    return res.data;
  },
  async getInvitations(type?: "received" | "sent") {
    const params = type ? `?type=${type}` : "";
    const res = await instance.get(`/collaborators/invitations${params}`);
    return res.data;
  },
  async acceptInvitation(invitationId: string) {
    const res = await instance.patch(`/collaborators/invitations/${invitationId}/accept`);
    return res.data;
  },
  async rejectInvitation(invitationId: string) {
    const res = await instance.patch(`/collaborators/invitations/${invitationId}/reject`);
    return res.data;
  },
  async getMyCollaborations() {
    const res = await instance.get("/collaborators/my-collaborations");
    return res.data;
  },
  // User profile and dashboard
  async getProfile() {
    const res = await instance.get("/users/me");
    return res.data;
  },
  async updateProfile(data: any) {
    const res = await instance.patch("/users/me", data);
    return res.data;
  },
  async getDashboard() {
    const res = await instance.get("/users/dashboard");
    return res.data;
  },
  async getMyIdeas() {
    const res = await instance.get("/ideas/my-ideas");
    return res.data;
  },
  // Favorites
  async addFavorite(ideaId: string) {
    const res = await instance.post(`/favorites/${ideaId}`);
    return res.data;
  },
  async removeFavorite(ideaId: string) {
    const res = await instance.delete(`/favorites/${ideaId}`);
    return res.data;
  },
  async getFavorites() {
    const res = await instance.get("/favorites");
    return res.data;
  },
  async checkFavorite(ideaId: string) {
    const res = await instance.get(`/favorites/check/${ideaId}`);
    return res.data;
  },
  // AI Features
  async validateAndScoreIdea(ideaId: string) {
    const res = await instance.post(`/ideas/${ideaId}/validate-and-score`);
    return res.data;
  },
  async getAISuggestions(partialIdea: { title: string; description: string; category: string }) {
    const res = await instance.post("/ideas/ai-suggestions", partialIdea);
    return res.data;
  },
};
