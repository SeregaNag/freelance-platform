"use client";

import { UserProfile } from "@/types/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Пользователь не авторизован");
        }
        const data = await res.json();
        setProfile(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Ошибка получения профиля"
        );
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <Container className="min-h-screen flex flex-col items-center justify-center">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка профиля...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-screen flex flex-col items-center justify-center">
        <Typography variant="h6" sx={{ mt: 2 }} color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen flex flex-col items-center justify-center">
      <Typography variant="h4" gutterBottom>
        Профиль пользователя
      </Typography>
      {profile && (
        <Box className="bg-white shadow-md rounded p-4 w-full max-w-md">
          <Typography variant="body1">
            <strong>ID:</strong> {profile.id}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {profile.email}
          </Typography>
          <Typography variant="body1">
            <strong>Имя:</strong> {profile.name || "Не указано"}
          </Typography>
          <Typography variant="body1">
            <strong>Роли:</strong> {profile.roles.join(", ")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Создан: {new Date(profile.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Обновлён: {new Date(profile.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
