import {
  Button,
  Link as MuiLink,
  Paper,
  Typography,
  Chip,
  Box,
  Card,
  CardContent,
  CardActions,
  Stack,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { Order, OrderStatus, OrderApplication } from "@/types/order";
import { UserRole } from "@/types/roles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { useDispatch } from "react-redux";
import { orderModified } from "@/features/ordersSlice";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Заказ свободен";
    case "waiting_confirmation":
      return "Ожидает подтверждения";
    case "in_progress":
      return "В работе";
    case "completed":
      return "Завершен";
    case "cancelled":
      return "Отменен";
    default:
      return status;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch(status) {
    case "completed": return "success";
    case "in_progress": return "primary";
    case "waiting_confirmation": return "warning";
    case "cancelled": return "error";
    case "pending": return "info";
    default: return "default";
  }
};

interface OrderCardProps {
  order: Order;
  userRole: UserRole;
  currentUser?: UserProfile;
}

export default function OrderCard({
  order,
  userRole,
  currentUser,
}: OrderCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isCurrentUserOrder =
    currentUser && order.customer?.id === currentUser.id;
  const isCurrentUserFreelancer =
    currentUser && order.freelancer?.id === currentUser.id;
  const hasApplied = order.applications?.some(
    (app) => app.freelancer.id === currentUser?.id
  );

  const handleTakeOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/take`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при взятии заказа");
      }
      dispatch(orderModified(order.id));
      router.push(`/chat?orderId=${order.id}`);
    } catch (error) {
      console.error("Ошибка при взятии заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);
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
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Ошибка при подтверждении заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при удалении заказа");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при удалении заказа", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/apply`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при подаче заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при подаче заявки", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/applications/${applicationId}/accept`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при принятии заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при принятии заявки", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/applications/${applicationId}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Ошибка при отклонении заявки");
      }
      dispatch(orderModified(order.id));
    } catch (error) {
      console.error("Ошибка при отклонении заявки", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  // Формат даты
  const formattedDate = format(new Date(order.createdAt), 'dd MMM', { locale: ru });

  return (
    <Card 
      sx={{ 
        mb: 3, 
        cursor: 'pointer', 
        transition: 'all 0.3s ease',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)'
        },
        border: isCurrentUserOrder 
          ? '2px solid #4CAF50' 
          : isCurrentUserFreelancer 
            ? '2px solid #2196F3' 
            : '1px solid #e0e0e0',
        overflow: 'visible',
        position: 'relative'
      }}
      onClick={navigateToDetails}
    >
      {isCurrentUserOrder && (
        <Chip
          label="Ваш заказ"
          color="success"
          size="small"
          sx={{ 
            position: "absolute", 
            top: -10, 
            right: 16, 
            fontWeight: 'bold',
            zIndex: 1 
          }}
        />
      )}
      {isCurrentUserFreelancer && (
        <Chip
          label="Вы исполнитель"
          color="primary"
          size="small"
          sx={{ 
            position: "absolute", 
            top: -10, 
            right: 16, 
            fontWeight: 'bold',
            zIndex: 1 
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                {order.title}
              </Typography>
              <Chip 
                label={getStatusText(order.status)} 
                color={getStatusColor(order.status)} 
                size="medium"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2, 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '2.5em'
              }}
            >
              {order.description}
            </Typography>
            
            {order.skills && order.skills.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {order.skills.slice(0, 3).map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    variant="outlined" 
                    size="small" 
                    color="primary"
                  />
                ))}
                {order.skills.length > 3 && (
                  <Chip 
                    label={`+${order.skills.length - 3}`} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {order.customer?.avatar ? (
                <Avatar 
                  src={order.customer.avatar} 
                  alt={order.customer.name || ''} 
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
              ) : (
                <Avatar 
                  sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
                >
                  {(order.customer?.name || 'U')[0].toUpperCase()}
                </Avatar>
              )}
              <Box>
                <Typography variant="subtitle2">
                  {order.customer?.name || order.customer?.email || 'Заказчик'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {order.price} ₽
              </Typography>
              {order.minBudget && order.maxBudget && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  (бюджет: {order.minBudget}-{order.maxBudget} ₽)
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        <Button 
          size="small" 
          color="primary" 
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            navigateToDetails();
          }}
        >
          Подробнее
        </Button>
        
        {userRole === "freelancer" && order.status === "pending" && !isCurrentUserOrder && !hasApplied && (
          <Button 
            size="small" 
            color="primary" 
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
            disabled={isLoading}
          >
            Откликнуться
          </Button>
        )}
        
        {isCurrentUserOrder && order.status === "waiting_confirmation" && (
          <Button 
            size="small" 
            color="success" 
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleConfirmOrder();
            }}
            disabled={isLoading}
          >
            Подтвердить
          </Button>
        )}
        
        {order.applications && order.applications.length > 0 && isCurrentUserOrder && (
          <Button 
            size="small" 
            color="info" 
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigateToDetails();
            }}
          >
            Заявки ({order.applications.length})
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
