"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box, Link as MuiLink, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/authSlice";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка при входе");
      }

      // Получаем профиль пользователя
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          credentials: "include",
        }
      );

      if (!profileRes.ok) {
        throw new Error("Ошибка при получении профиля");
      }

      const profileData = await profileRes.json();

      // Устанавливаем состояние аутентификации
      dispatch(setAuth({ 
        isAuthenticated: true, 
        user: {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role
        }
      }));

      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Вход в систему
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
      >
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Пароль"
          name="password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <MuiLink
            component={Link}
            href="/register"
            sx={{ 
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Нет аккаунта? Зарегистрируйтесь
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
}
