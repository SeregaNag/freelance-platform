import { Box, Typography, Button } from "@mui/material";
import { Order } from "@/types/order";
import { getOrder } from "@/api/api";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/roles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { orderModified } from "@/features/ordersSlice";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch();

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
      dispatch(orderModified(order.id));
      router.push("/");
    } catch (error) {
      console.error("Ошибка при подтверждении заказа", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {order.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {order.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Цена: {order.price}
      </Typography>
      <Typography variant="body1" paragraph>
        Статус: {order.status}
      </Typography>

      {role === "client" && order.status === "in_progress" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmOrder}
        >
          Подтвердить заказ
        </Button>
      )}
    </Box>
  );
} 