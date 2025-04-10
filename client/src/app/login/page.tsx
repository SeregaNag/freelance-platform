"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { setProfile } from "@/features/profileSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Неверные учетные данные");
      }

      // Получаем профиль после успешного входа
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          credentials: "include",
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        dispatch(setProfile(profileData));
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при входе");
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
        >
          Войти
        </Button>
      </Box>
    </Container>
  );
}
