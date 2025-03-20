import OrderCard from "./OrderCard";
import { Order } from "@/types/order";
import { getOrders } from "@/api/api";
import { useEffect, useState } from "react";

export default function OrderCardList({ filter }: { filter: string }) {
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
  }, [])
  
  
  return (
    <ul>
      {orders.map(order => (
        (order.status === filter || filter === "all") &&
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
}