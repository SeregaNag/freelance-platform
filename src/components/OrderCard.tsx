import { Link, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/types/order";

export default function OrderCard() {
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
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5">Создать SPA, на Next.js</Typography>
      <Typography variant="subtitle1">Цена: 1000 руб</Typography>

      <Typography variant="subtitle2" color={statusColor}>
        Статус: {status}
      </Typography>
      <Link href="/order/1" underline="none">
        Подробнее
      </Link>
    </Paper>
  );
}
