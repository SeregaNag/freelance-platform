"use client";

import { Button, Container, Typography } from "@mui/material";
import OrderCard from "@/components/OrderCard";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Платформа фриланс-заказов
      </Typography>
      <Button variant="contained" color="primary">
        Начать
      </Button>
      <OrderCard />
    </Container>
  );
}
