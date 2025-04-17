"use client";

import { UserProfile } from "@/types/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Typography, Grid, Chip, Link } from "@mui/material";
import LoadingSpinner from "@/components/LoadingSpinner";
import EditProfileForm from "@/components/EditProfileForm";
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) {
        throw new Error("Ошибка при сохранении профиля");
      }
      const data = await res.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      setError("Ошибка при сохранении профиля");
    }
  };

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
    <Container className="min-h-screen py-8">
      <Typography variant="h4" gutterBottom>
        Профиль пользователя
      </Typography>
      {isEditing && profile ? (
        <EditProfileForm profile={profile} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
      ) : (
        profile && (
        <Box className="bg-white shadow-md rounded p-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {profile.avatar && (
                <Box className="mb-4">
                  <Image
                    src={profile.avatar}
                    alt="Аватар"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                </Box>
              )}
              <Typography variant="h6" gutterBottom>
                {profile.name || "Без имени"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>
              {profile.isVerified && (
                <Chip
                  label="Верифицирован"
                  color="success"
                  size="small"
                  className="mt-2"
                />
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              {profile.bio && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    О себе
                  </Typography>
                  <Typography variant="body1">
                    {profile.bio}
                  </Typography>
                </Box>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    Навыки
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))}
                  </Box>
                </Box>
              )}

              {profile.experience && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    Опыт работы
                  </Typography>
                  <Typography variant="body1">
                    {profile.experience}
                  </Typography>
                </Box>
              )}

              {profile.location && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    Местоположение
                  </Typography>
                  <Typography variant="body1">
                    {profile.location}
                  </Typography>
                </Box>
              )}

              {profile.website && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    Веб-сайт
                  </Typography>
                  <Link href={profile.website} target="_blank">
                    {profile.website}
                  </Link>
                </Box>
              )}

              {profile.socialLinks && (
                <Box className="mb-4">
                  <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                    Социальные сети
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {profile.socialLinks.github && (
                      <Link href={profile.socialLinks.github} target="_blank">
                        GitHub
                      </Link>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Link href={profile.socialLinks.linkedin} target="_blank">
                        LinkedIn
                      </Link>
                    )}
                    {profile.socialLinks.twitter && (
                      <Link href={profile.socialLinks.twitter} target="_blank">
                        Twitter
                      </Link>
                    )}
                    {profile.socialLinks.portfolio && (
                      <Link href={profile.socialLinks.portfolio} target="_blank">
                        Портфолио
                      </Link>
                    )}
                  </Box>
                </Box>
              )}

              <Box className="mb-4">
                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                  Статистика
                </Typography>
                <Typography variant="body1">
                  Рейтинг: {profile.rating || 0}
                </Typography>
                <Typography variant="body1">
                  Выполнено заказов: {profile.completedOrders || 0}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Редактировать профиль
              </Button>

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
              >
                Выйти из аккаунта
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Container>
  );
}
