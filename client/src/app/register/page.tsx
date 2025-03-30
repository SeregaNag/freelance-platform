"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Container, Typography, TextField, Button, Box } from "@mui/material";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        setError(res.statusText);
      }
      router.push("/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ошибка регистрации");
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-screen">
      <Typography variant="h4" component="h1" gutterBottom>
        Регистрация
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
      >
        <TextField
          fullWidth
          label="Имя"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
          type="email"
        />
        <TextField
          fullWidth
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
          type="password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
}
