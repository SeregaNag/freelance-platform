import OrderCard from "./OrderCard";
import { Order } from "@/types/order";
import { getOrders } from "@/api/api";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";

export default function OrderCardList({
  filter,
  role,
}: {
  filter: string;
  role: UserRole;
}) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <ul>
      {orders.map(
        (order) =>
          (order.status === filter || filter === "all") && (
            <OrderCard key={order.id} order={order} userRole={role} />
          )
      )}
    </ul>
  );
}
