export type OrderStatus = "pending" | "completed" | "cancelled";
export type OrderStatusFilter = "all" | OrderStatus;

export interface OrderCardProps {
  status: OrderStatus;
}
