"use client";

import { Button, Container, Typography } from "@mui/material";
import OrderList from "@/components/OrderList";
import RoleSwitch from "@/components/RoleSwitch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { use, useEffect, useState } from "react";
import ModalWindow from "@/components/Modal";
import CreateOrderForm from "@/components/CreateOrderForm";

export default function Home() {
  const role = useSelector((state: RootState) => state.user.role);
  const [currentRole, setCurrentRole] = useState(role);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {role === 'client' && 
      <>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 3 }}
        onClick={() => setIsModalOpen(true)}
      >
        Разместить заказ
      </Button>
      
      <ModalWindow isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}> <CreateOrderForm onClose={() => setIsModalOpen(false)}/></ModalWindow>
      </>
      }
      {currentRole === 'freelancer' && <OrderList />}
    </Container>
  );
}
