import { Link, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/types/order";
import { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({order}: OrderCardProps) {
  const [status, setStatus] = useState<OrderStatus>("completed");
  const [statusColor, setStatusColor] = useState("black");

  useEffect(() => {
    setStatus("completed");
    if (status === "completed") {
      setStatusColor("green");
    } else if (status === "pending") {
      setStatusColor("yellow");
    } else if (status === "cancelled") {
      setStatusColor("grey");
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5">{order.title}</Typography>
      <Typography variant="subtitle1">{order.price}</Typography>

      <Typography variant="subtitle2" color={statusColor}>
        Статус: {order.status}
      </Typography>
      <Link href="/order/1" underline="none">
        Подробнее
      </Link>
    </Paper>
  );
}
