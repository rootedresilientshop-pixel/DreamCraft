// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  userType: 'creator' | 'collaborator' | 'admin';
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    skills?: string[];
    location?: string;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Idea Types
export interface Idea {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  documentation: {
    problemStatement: string;
    targetMarket: string;
    solutionOverview: string;
    uniqueValue: string;
    competitors?: string;
    businessModel?: string;
  };
  valuation: {
    estimatedValue: number;
    aiScore: number;
    marketSize?: string;
    confidence: number;
  };
  status: 'draft' | 'published' | 'sold' | 'in-collaboration';
  visibility: 'private' | 'public';
  price?: number;
  nda: {
    required: boolean;
    hash: string; // Timestamp hash for proof of creation
  };
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  ideaId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'purchase' | 'partnership' | 'licensing';
  stripePaymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Collaborator Request Types
export interface CollaborationRequest {
  id: string;
  ideaId: string;
  creatorId: string;
  collaboratorId: string;
  role: 'developer' | 'designer' | 'marketer' | 'advisor';
  equityOffer?: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'explorer' | 'builder' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  price: number;
  renewalDate: Date;
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI Valuation Request
export interface ValuationRequest {
  title: string;
  description: string;
  targetMarket: string;
  competitors?: string;
  marketSize?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
