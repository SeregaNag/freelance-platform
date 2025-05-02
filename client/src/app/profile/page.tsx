"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setProfile } from "@/features/profileSlice";
import { UserProfile } from "@/types/profile";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Ошибка при получении профиля");
        }
        const data = await res.json();
        dispatch(setProfile(data));
        setEditedProfile(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [dispatch, router, isAuthenticated]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editedProfile),
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка при обновлении профиля");
      }

      const data = await res.json();
      dispatch(setProfile(data));
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {profile?.avatar ? (
                <Avatar
                  src={profile.avatar}
                  alt={profile.name || ""}
                  sx={{ width: 120, height: 120 }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: "3rem",
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                >
                  {(profile?.name || "U")[0].toUpperCase()}
                </Avatar>
              )}
              <Typography variant="h5" component="h1" align="center">
                {profile?.name || "Пользователь"}
              </Typography>
              <Chip
                label={profile?.roles?.includes("freelancer") ? "Фрилансер" : "Заказчик"}
                color="primary"
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white'
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Информация о профиле
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {isEditing ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Имя"
                    value={editedProfile?.name || ""}
                    onChange={(e) =>
                      setEditedProfile((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={editedProfile?.email || ""}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="О себе"
                    multiline
                    rows={4}
                    value={editedProfile?.bio || ""}
                    onChange={(e) =>
                      setEditedProfile((prev) =>
                        prev ? { ...prev, bio: e.target.value } : null
                      )
                    }
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={isLoading}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                        }
                      }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography>{profile?.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      О себе
                    </Typography>
                    <Typography>
                      {profile?.bio || "Нет информации о себе"}
                    </Typography>
                  </Box>
                  {profile?.skills && profile.skills.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Навыки
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.skills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill}
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              color: 'white'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {profile?.experience && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Опыт работы
                      </Typography>
                      <Typography>{profile.experience}</Typography>
                    </Box>
                  )}
                  {profile?.location && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Местоположение
                      </Typography>
                      <Typography>{profile.location}</Typography>
                    </Box>
                  )}
                  {profile?.website && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Веб-сайт
                      </Typography>
                      <MuiLink 
                        href={profile.website} 
                        target="_blank"
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {profile.website}
                      </MuiLink>
                    </Box>
                  )}
                  {profile?.socialLinks && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Социальные сети
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {profile.socialLinks.github && (
                          <MuiLink 
                            href={profile.socialLinks.github} 
                            target="_blank"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            GitHub
                          </MuiLink>
                        )}
                        {profile.socialLinks.linkedin && (
                          <MuiLink 
                            href={profile.socialLinks.linkedin} 
                            target="_blank"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            LinkedIn
                          </MuiLink>
                        )}
                        {profile.socialLinks.twitter && (
                          <MuiLink 
                            href={profile.socialLinks.twitter} 
                            target="_blank"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Twitter
                          </MuiLink>
                        )}
                        {profile.socialLinks.portfolio && (
                          <MuiLink 
                            href={profile.socialLinks.portfolio} 
                            target="_blank"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Портфолио
                          </MuiLink>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Статистика
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Рейтинг
                        </Typography>
                        <Typography variant="h6">
                          {profile?.rating || 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Выполнено заказов
                        </Typography>
                        <Typography variant="h6">
                          {profile?.completedOrders || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleEdit}
                    sx={{ alignSelf: "flex-start", mt: 2 }}
                  >
                    Редактировать профиль
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
