import axios from "axios";
import { removeToken, dispatchAuthChanged } from "./utils/authStorage";

const API_BASE = (import.meta.env as any).VITE_API_BASE || "http://localhost:3002/api";

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: Add token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle 401 errors (expired/invalid tokens)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid
      removeToken();
      dispatchAuthChanged();
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  async register(email: string, password: string, userType?: string, inviteCode?: string) {
    try {
      const res = await instance.post("/auth/register", {
        email,
        username: email.split("@")[0],
        password,
        userType: userType || "creator",
        inviteCode: inviteCode || undefined,
      });
      return res.data;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error || error.message || "Registration failed";
      return { error: errorMsg };
    }
  },
  async login(email: string, password: string) {
    try {
      const res = await instance.post("/auth/login", { email, password });
      return res.data || {};
    } catch (error: any) {
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
  async inviteCollaborator(
    collaboratorId: string,
    ideaId: string,
    role?: string,
    message?: string,
    timeCommitment?: number,
    equityPercentage?: number,
    successDefinition?: string,
    timelineToMVP?: string
  ) {
    const res = await instance.post("/collaborators/invite", {
      collaboratorId,
      ideaId,
      role,
      message,
      timeCommitment,
      equityPercentage,
      successDefinition,
      timelineToMVP,
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
  // NDA Methods
  async acceptNDA(collaborationId: string) {
    const res = await instance.patch(`/collaborators/invitations/${collaborationId}/accept-nda`);
    return res.data;
  },
  async getNDAStatus(collaborationId: string) {
    const res = await instance.get(`/collaborators/invitations/${collaborationId}/nda-status`);
    return res.data;
  },
  // User profile and dashboard
  async getProfile() {
    const res = await instance.get("/users/me");
    return res.data;
  },
  async updateProfile(data: any) {
    try {
      const res = await instance.patch("/users/me", data);
      return res.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Failed to update profile";
      console.error('updateProfile error:', {
        status: error.response?.status,
        errorMsg,
        fullError: error
      });
      throw new Error(errorMsg);
    }
  },
  async completeOnboarding(data: { type: 'collaborator-wizard' | 'creator-intro' }) {
    try {
      const res = await instance.post("/users/complete-onboarding", data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || "Failed to complete onboarding");
    }
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
  async getLeaderboard(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    const res = await instance.get(`/ideas/leaderboard/top${params}`);
    return res.data;
  },
  // Templates
  async getTemplates() {
    const res = await instance.get("/templates");
    return res.data;
  },
  // Sample data creation for testing
  async createSampleIdeas() {
    try {
      const res = await instance.post("/ideas/dev/create-samples", {});
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to create sample ideas");
    }
  },
  // Admin API methods
  async createInviteCode(maxUses?: number, expiresAt?: string, description?: string) {
    const res = await instance.post("/admin/invite-codes", {
      maxUses,
      expiresAt,
      description,
    });
    return res.data;
  },
  async listInviteCodes() {
    const res = await instance.get("/admin/invite-codes");
    return res.data;
  },
  async getInviteCode(id: string) {
    const res = await instance.get(`/admin/invite-codes/${id}`);
    return res.data;
  },
  async deactivateInviteCode(id: string) {
    const res = await instance.patch(`/admin/invite-codes/${id}/deactivate`);
    return res.data;
  },
  async getBetaUsers() {
    const res = await instance.get("/admin/beta-users");
    return res.data;
  },
  async getAdminStats() {
    const res = await instance.get("/admin/stats");
    return res.data;
  },
  // Feedback API methods
  async createFeedback(data: {
    category: string;
    title: string;
    description: string;
    priority: string;
    attachmentUrl?: string;
  }) {
    const res = await instance.post("/feedback", data);
    return res.data;
  },
  async listFeedback(status?: string, category?: string, sort?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    const res = await instance.get(`/feedback${params.toString() ? '?' + params : ''}`);
    return res.data;
  },
  async getMyFeedback() {
    const res = await instance.get("/feedback/user/my-feedback");
    return res.data;
  },
  async getFeedback(id: string) {
    const res = await instance.get(`/feedback/${id}`);
    return res.data;
  },
  async upvoteFeedback(id: string) {
    const res = await instance.post(`/feedback/${id}/upvote`);
    return res.data;
  },
  async updateFeedback(id: string, data: any) {
    const res = await instance.patch(`/feedback/${id}`, data);
    return res.data;
  },
  async deleteFeedback(id: string) {
    const res = await instance.delete(`/feedback/${id}`);
    return res.data;
  },
  async getFeedbackStats() {
    const res = await instance.get("/feedback/stats/summary");
    return res.data;
  },
};
