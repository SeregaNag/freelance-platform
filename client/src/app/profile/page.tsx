"use client";

import { UserProfile } from "@/types/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import LoadingSpinner from "@/components/LoadingSpinner";

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
    return <LoadingSpinner message="Загрузка профиля..." />;
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
            <strong>Email:</strong> {profile.email}
          </Typography>
          <Typography variant="body1">
            <strong>Имя:</strong> {profile.name || "Не указано"}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                router.push("/login");
              } catch (error) {
                console.error("Ошибка при выходе:", error);
              }
            }}
            sx={{ mt: 2 }}
          >
            Выйти из аккаунта
          </Button>
        </Box>
      )}
    </Container>
  );
}
