'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                setError(res.statusText);
            }
            router.push("/");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Ошибка авторизации");
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex flex-col items-center justify-center">
            <Typography variant="h4" component="h1" gutterBottom>
        Вход в систему
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Пароль"
          name="password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit" color="primary" fullWidth sx={{ mt: 2 }}>
          Войти
        </Button>
      </Box>
        </Container>
    )
}