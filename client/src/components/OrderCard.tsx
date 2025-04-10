import {
  Button,
  Link as MuiLink,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { Order, OrderStatus, OrderApplication } from "@/types/order";
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
    case "waiting_confirmation":
      return "Ожидает подтверждения";
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

export default function OrderCard({
  order,
  userRole,
  currentUser,
}: OrderCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isCurrentUserOrder =
    currentUser && order.customer?.id === currentUser.id;
  const isCurrentUserFreelancer =
    currentUser && order.freelancer?.id === currentUser.id;
  const hasApplied = order.applications?.some(
    (app) => app.freelancer.id === currentUser?.id
  );

  const statusColor =
    order.status === "completed"
      ? "green"
      : order.status === "pending"
      ? "yellow"
      : order.status === "cancelled"
      ? "grey"
      : order.status === "in_progress"
      ? "blue"
      : order.status === "waiting_confirmation"
      ? "orange"
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

  const handleApply = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/apply`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при подаче заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при подаче заявки", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/applications/${applicationId}/accept`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при принятии заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при принятии заявки", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/applications/${applicationId}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при отклонении заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при отклонении заявки", error);
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
        border: isCurrentUserOrder ? "2px solid #4CAF50" : "none",
        position: "relative",
      }}
    >
      {isCurrentUserOrder && (
        <Chip
          label="Ваш заказ"
          color="success"
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        />
      )}
      {isCurrentUserFreelancer && (
        <Chip
          label="Вы исполнитель"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
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

      {order.applications && order.applications.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Заявки:</Typography>
          {order.applications.map((app) => (
            <Box key={app.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography variant="body2">
                {app.freelancer.name || app.freelancer.email}
              </Typography>
              {isCurrentUserOrder && order.status === "pending" && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleAcceptApplication(app.id)}
                    disabled={isLoading}
                  >
                    Принять
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleRejectApplication(app.id)}
                    disabled={isLoading}
                  >
                    Отклонить
                  </Button>
                </>
              )}
            </Box>
          ))}
        </Box>
      )}

      <MuiLink href={`/orders/${order.id}`} underline="none">
        Подробнее
      </MuiLink>

      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {userRole === "freelancer" &&
          order.status === "pending" &&
          !isCurrentUserOrder && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleTakeOrder}
              disabled={isLoading}
            >
              Взять заказ
            </Button>
          )}

        {isCurrentUserOrder && 
          order.status === "waiting_confirmation" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmOrder}
              disabled={isLoading}
            >
              Подтвердить исполнителя
            </Button>
          )}

        {isCurrentUserOrder && order.status === "pending" && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteOrder}
            disabled={isLoading}
          >
            Удалить
          </Button>
        )}
      </Box>
    </Paper>
  );
}
