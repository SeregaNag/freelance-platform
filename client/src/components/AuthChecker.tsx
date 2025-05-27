'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/features/authSlice';
import { setProfile } from '@/features/profileSlice';

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем профиль пользователя (если токен валиден, сервер вернет данные)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);

        if (res.ok) {
          const profileData = await res.json();
          
          // Устанавливаем состояние аутентификации
          dispatch(setAuth({ 
            isAuthenticated: true, 
            user: {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.roles?.[0] || 'freelancer' // Берем первую роль или по умолчанию freelancer
            }
          }));

          // Устанавливаем профиль
          dispatch(setProfile(profileData));
        } else {
          // Если токен невалиден, очищаем состояние
          dispatch(setAuth({ 
            isAuthenticated: false, 
            user: null 
          }));
          dispatch(setProfile(null));
        }
      } catch (error) {
        // Если запрос был отменен (таймаут), не логируем как ошибку
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Ошибка при проверке аутентификации:", error);
        }
        // В случае ошибки очищаем состояние
        dispatch(setAuth({ 
          isAuthenticated: false, 
          user: null 
        }));
        dispatch(setProfile(null));
      }
    };

    checkAuth();
  }, [dispatch]);

  // Показываем контент сразу, проверка идет в фоне
  return <>{children}</>;
} 