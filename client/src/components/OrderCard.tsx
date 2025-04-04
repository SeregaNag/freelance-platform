import { Button, Link as MuiLink, Paper, Typography } from "@mui/material";
import { Order, OrderStatus } from "@/types/order";
import { UserRole } from "@/types/roles";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Заказ свободен";
    case "in_progress":
      return "В работе";
    case "completed":
      return "Завершен";
    case "cancelled":
      return "Отменен";
    default:
      return status;
  }
};

interface OrderCardProps {
  order: Order;
  userRole: UserRole;
}

export default function OrderCard({ order, userRole }: OrderCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const statusColor =
    order.status === "completed"
      ? "green"
      : order.status === "pending"
      ? "yellow"
      : order.status === "cancelled"
      ? "grey"
      : order.status === "in_progress"
      ? "blue"
      : "black";

  const handleTakeOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/take`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при взятии заказа");
      }
      router.push(`/chat?orderId=${order.id}`);
    } catch (error) {
      console.error("Ошибка при взятии заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/confirm`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при подтверждении заказа");
      }
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Ошибка при подтверждении заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5">{order.title}</Typography>
      <Typography variant="subtitle1">Цена: {order.price}</Typography>

      <Typography variant="subtitle2" color={statusColor}>
        Статус: {getStatusText(order.status)}
      </Typography>

      {order.customer && (
        <Typography variant="body2">
          Заказчик: {order.customer.name || order.customer.email}
        </Typography>
      )}
      <MuiLink href={`/orders/${order.id}`} underline="none">
        Подробнее
      </MuiLink>
      {/* Если текущий пользователь — фрилансер и заказ еще в состоянии "pending", показываем кнопку "Взять заказ" */}
      {userRole === "freelancer" && order.status === "pending" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleTakeOrder}
          sx={{ mt: 1 }}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Взять заказ"}
        </Button>
      )}
      {userRole === "client" && order.status === "in_progress" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmOrder}
          sx={{ mt: 1 }}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Подтвердить заказ"}
        </Button>
      )}
    </Paper>
  );
}
