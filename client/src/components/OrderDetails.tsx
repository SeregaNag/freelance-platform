"use client";

import { Box, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText, Grid, Divider, Card, CardContent } from "@mui/material";
import { Order } from "@/types/order";
import { getOrder } from "@/api/api";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/roles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { orderModified } from "@/features/ordersSlice";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

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

  const handleOpenChat = () => {
    router.push(`/chat?orderId=${order.id}`);
  };

  // Форматирование дедлайна
  const formattedDeadline = order.deadline 
    ? format(new Date(order.deadline), 'dd MMMM yyyy', { locale: ru })
    : 'Не указан';

  // Определение цвета статуса
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'waiting_confirmation': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Перевод статуса на русский
  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Ожидает';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'waiting_confirmation': return 'Ожидает подтверждения';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {order.title}
            </Typography>
            <Chip 
              label={getStatusText(order.status)} 
              color={getStatusColor(order.status) as any}
              sx={{ fontWeight: 'medium', px: 1 }}
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="medium" color="primary" gutterBottom>
                Описание
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {order.description}
              </Typography>
              
              {order.skills && order.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="medium" color="primary" gutterBottom>
                    Требуемые навыки
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {order.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        variant="outlined" 
                        color="primary"
                        size="medium"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {order.attachments && order.attachments.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="medium" color="primary" gutterBottom>
                    Приложенные файлы
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <List dense disablePadding>
                      {order.attachments.map((file, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={file} 
                            primaryTypographyProps={{ 
                              sx: { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' } 
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="medium" color="primary" gutterBottom>
                  Информация о заказе
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Категория
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {order.category || 'Не указана'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Срок выполнения
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formattedDeadline}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Бюджет
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {order.minBudget && order.maxBudget 
                        ? `${order.minBudget} - ${order.maxBudget} ₽`
                        : order.minBudget 
                          ? `от ${order.minBudget} ₽`
                          : order.maxBudget 
                            ? `до ${order.maxBudget} ₽`
                            : 'Не указан'
                      }
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Цена
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {order.price} ₽
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Дата публикации
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: ru })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              {order.customer && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mt: 3 }}>
                  <Typography variant="h6" fontWeight="medium" color="primary" gutterBottom>
                    Заказчик
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {order.customer.name || 'Имя не указано'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {order.status === "in_progress" && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {role === "client" && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleConfirmOrder}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Подтвердить заказ
            </Button>
          )}
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleOpenChat}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Открыть чат
          </Button>
        </Stack>
      )}
    </Box>
  );
} 