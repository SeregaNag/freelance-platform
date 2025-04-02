import { Button, Link as MuiLink, Paper, Typography } from "@mui/material";
import { Order } from "@/types/order";
import { UserRole } from "@/types/roles";
import { useRouter } from "next/navigation";
interface OrderCardProps {
  order: Order;
  userRole: UserRole;
}

export default function OrderCard({ order, userRole }: OrderCardProps) {
  const router = useRouter();

  const statusColor =
    order.status === "completed"
      ? "green"
      : order.status === "pending"
      ? "yellow"
      : order.status === "cancelled"
      ? "grey"
      : "black";

  const handleTakeOrder = async () => {
    try {
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
    }
  };

  const handleConfirmOrder = async () => {
    try {
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
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5">{order.title}</Typography>
      <Typography variant="subtitle1">Цена: {order.price}</Typography>

      <Typography variant="subtitle2" color={statusColor}>
        Статус: {order.status}
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
        >
          Взять заказ
        </Button>
      )}
      {userRole === "client" && order.status === "in_progress" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmOrder}
          sx={{ mt: 1 }}
        >
          Подтвердить заказ
        </Button>
      )}
    </Paper>
  );
}
