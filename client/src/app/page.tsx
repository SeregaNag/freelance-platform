"use client";

import { Button, Container, Typography, Box } from "@mui/material";
import OrderList from "@/components/OrderList";
import RoleSwitch from "@/components/RoleSwitch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import ModalWindow from "@/components/Modal";
import CreateOrderForm from "@/components/CreateOrderForm";
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  const role = useSelector((state: RootState) => state.user.role);
  const [currentRole, setCurrentRole] = useState(role);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentRole(role);
  }, [role]);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography 
        variant="h2" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '2rem', sm: '2.5rem' },
          fontWeight: 600,
          mb: 4
        }}
      >
        {role === "client"
          ? "Создайте новый заказ"
          : "Найдите подходящие проекты"}
      </Typography>

      <RoleSwitch />

      {role === "client" && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setIsModalOpen(true)}
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            Разместить заказ
          </Button>
        </Box>
      )}

      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CreateOrderForm onClose={() => setIsModalOpen(false)} />
      </ModalWindow>

      <OrderList role={currentRole} />
    </Container>
  );
}
