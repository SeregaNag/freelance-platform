import { UserProfile } from "./profile";

export type OrderStatus = "pending" | "waiting_confirmation" | "in_progress" | "completed" | "cancelled";
export type OrderStatusFilter = "all" | OrderStatus;

export interface OrderCardProps {
  status: OrderStatus;
}

export interface Order {
  id: string;
  title: string;
  description: string;
  price: number;
  status: OrderStatus;
  category?: string;
  deadline?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  attachments?: string[];
  customer?: UserProfile;
  freelancer?: UserProfile;
  applications?: OrderApplication[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderApplication {
  id: string;
  freelancer: UserProfile;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
