import OrderCard from "./OrderCard";
import { Order } from "@/types/order";
import { getOrders } from "@/api/api";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";
import LoadingSpinner from "./LoadingSpinner";
import { Typography } from "@mui/material";
import { UserProfile } from "@/types/profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function OrderCardList({
  filter,
  role,
}: {
  filter: string;
  role: UserRole;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const modifiedOrderIds = useSelector((state: RootState) => state.orders.modifiedOrderIds);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ошибка загрузки заказов");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [role, modifiedOrderIds]);

  if (loading) {
    return <LoadingSpinner message="Загрузка заказов..." />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <ul>
      {orders.map(
        (order) =>
          (order.status === filter || filter === "all") && (
            <OrderCard 
              key={order.id} 
              order={order} 
              userRole={role} 
              currentUser={currentUser || undefined}
            />
          )
      )}
    </ul>
  );
}
