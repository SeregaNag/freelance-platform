export type OrderStatus = "pending" | "completed" | "cancelled";

export interface OrderCardProps {
    status: OrderStatus;
  }