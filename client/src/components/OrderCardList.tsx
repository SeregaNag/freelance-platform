import OrderCard from "./OrderCard";
import { Order } from "@/types/order";
import { getOrders } from "@/api/api";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";
import LoadingSpinner from "./LoadingSpinner";
import { Typography, Box } from "@mui/material";
import { UserProfile } from "@/types/profile";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function OrderCardList({
  filter,
  role,
}: {
  filter: string;
  role: UserRole;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modifiedOrderIds = useSelector((state: RootState) => state.orders.modifiedOrderIds);
  const filters = useSelector((state: RootState) => state.filters);
  const currentUser = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ошибка загрузки заказов");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [role, modifiedOrderIds]);

  if (loading) {
    return <LoadingSpinner message="Загрузка заказов..." />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  // Применение фильтров к заказам
  const filteredOrders = orders.filter((order) => {
    // Фильтрация по статусу
    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }
    
    // Поиск по тексту (заголовок и описание)
    if (filters.searchQuery && !orderMatchesSearchQuery(order, filters.searchQuery)) {
      return false;
    }
    
    // Фильтрация по ценовому диапазону
    if (filters.priceRange.min !== null && order.price < filters.priceRange.min) {
      return false;
    }
    if (filters.priceRange.max !== null && order.price > filters.priceRange.max) {
      return false;
    }
    
    // Фильтрация по категориям
    if (
      filters.selectedCategories.length > 0 && 
      order.category && 
      !filters.selectedCategories.includes(order.category)
    ) {
      return false;
    }
    
    // Фильтрация по навыкам
    if (
      filters.selectedSkills.length > 0 && 
      (!order.skills || !hasMatchingSkill(order.skills, filters.selectedSkills))
    ) {
      return false;
    }
    
    return true;
  });

  // Сортировка заказов
  const sortedFilteredOrders = [...filteredOrders].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price_high":
        return b.price - a.price;
      case "price_low":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Если нет заказов после фильтрации
  if (sortedFilteredOrders.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        my: 8
      }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Заказы не найдены
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Попробуйте изменить параметры фильтрации
        </Typography>
      </Box>
    );
  }

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {sortedFilteredOrders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          userRole={role} 
          currentUser={currentUser || undefined}
        />
      ))}
    </ul>
  );
}

// Вспомогательные функции
function orderMatchesSearchQuery(order: Order, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Проверка заголовка
  if (order.title.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Проверка описания
  if (order.description.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Проверка категории
  if (order.category && order.category.toLowerCase().includes(lowerQuery)) {
    return true;
  }
  
  // Проверка навыков
  if (order.skills && order.skills.some(skill => 
    skill.toLowerCase().includes(lowerQuery)
  )) {
    return true;
  }
  
  // Проверка имени заказчика
  if (
    order.customer && 
    (
      (order.customer.name && order.customer.name.toLowerCase().includes(lowerQuery)) ||
      (order.customer.email && order.customer.email.toLowerCase().includes(lowerQuery))
    )
  ) {
    return true;
  }
  
  return false;
}

function hasMatchingSkill(orderSkills: string[], filterSkills: string[]): boolean {
  return filterSkills.some(skill => 
    orderSkills.some(orderSkill => 
      orderSkill.toLowerCase() === skill.toLowerCase()
    )
  );
}
