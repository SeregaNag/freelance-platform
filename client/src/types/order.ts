import { UserProfile } from "./profile";

export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
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
  createdAt: string;
  updatedAt: string;
  customer?: UserProfile;
  freelancer?: UserProfile;
}
