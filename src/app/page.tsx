"use client";

import { Button, Container, Typography } from "@mui/material";
import OrderList from "@/components/OrderList";
import RoleSwitch from "@/components/RoleSwitch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CreateOrderButton from "@/components/CreateOrderButton";

export default function Home() {
  const role = useSelector((state: RootState) => state.user.role);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h2" gutterBottom>
        {role === 'client' ? 'Создайте новый заказ' : 'Найдите подходящие проекты'}
      </Typography>
      
      <RoleSwitch />
      
      <Button 
        variant="contained" 
        color="secondary"
        sx={{ mt: 3 }}
      >
        {role === 'freelancer' ? 'Разместить заказ' : 'Показать задания'}
      </Button>

      {role === 'client' && <CreateOrderButton />}
      <OrderList />
    </Container>
  );
}
