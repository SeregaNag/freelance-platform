export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;

  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  rating?: number;
  completedOrders?: number;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  isVerified?: boolean;
  lastSeen?: string;
}
