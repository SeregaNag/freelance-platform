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
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                }
              }}
            >
              Разместить заказ
            </Button>
          </Box>
        </motion.div>
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
