"use client";

import { Button, Container, Typography } from "@mui/material";
import OrderList from "@/components/OrderList";
import RoleSwitch from "@/components/RoleSwitch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { use, useEffect, useState } from "react";

export default function Home() {
  const role = useSelector((state: RootState) => state.user.role);
  const [currentRole, setCurrentRole] = useState(role);

  useEffect(() => {
    setCurrentRole(role);
  }
  , [role]);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h2" gutterBottom>
        {role === 'client' ? 'Создайте новый заказ' : 'Найдите подходящие проекты'}
      </Typography>
      
      <RoleSwitch />
      
      {role === 'client' && <Button 
        variant="contained" 
        color="secondary"
        sx={{ mt: 3 }}
        onClick={() => {
          if (role === 'client') {
            // создание заказа
            console.log('Order created');
          } else {
            // фильтрация
            console.log('Filtering orders');
          }
        }}
      >
        Разместить заказ
      </Button>}
      {currentRole === 'freelancer' && <OrderList />}
    </Container>
  );
}
