import { Button, Link as MuiLink, Paper, Typography, Chip } from "@mui/material";
import { Order, OrderStatus } from "@/types/order";
import { UserRole } from "@/types/roles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { useDispatch } from "react-redux";
import { orderModified } from "@/features/ordersSlice";

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
  currentUser?: UserProfile;
}

export default function OrderCard({ order, userRole, currentUser }: OrderCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isCurrentUserOrder = currentUser && order.customer?.id === currentUser.id;
  const isCurrentUserFreelancer = currentUser && order.freelancer?.id === currentUser.id;

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
      dispatch(orderModified(order.id));
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
      dispatch(orderModified(order.id));
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Ошибка при подтверждении заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при удалении заказа");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при удалении заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2,
        border: isCurrentUserOrder ? '2px solid #4CAF50' : 'none',
        position: 'relative'
      }}
    >
      {isCurrentUserOrder && (
        <Chip 
          label="Ваш заказ" 
          color="success" 
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      )}
      {isCurrentUserFreelancer && (
        <Chip 
          label="Вы исполнитель" 
          color="primary" 
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      )}
      
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
      
      <div className="flex gap-2 mt-2">
        {userRole === "freelancer" && 
         order.status === "pending" && 
         !isCurrentUserOrder && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleTakeOrder}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Взять заказ"}
          </Button>
        )}
        
        {userRole === "client" && 
         order.status === "in_progress" && 
         isCurrentUserOrder && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Подтвердить заказ"}
          </Button>
        )}

        {isCurrentUserOrder  && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteOrder}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Удалить заказ"}
          </Button>
        )}
      </div>
    </Paper>
  );
}
