export type OrderStatus = "pending" | "completed" | "cancelled";
export type OrderStatusFilter = "all" | OrderStatus;

export interface OrderCardProps {
  status: OrderStatus;
}

export interface Order {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}