"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
import { usePathname } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            credentials: "include", // отправляем httpOnly cookie
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between items-center">
        {/* Логотип/название платформы */}
        <Link
          href="/"
          passHref
          className={`link ${pathname === "/" ? "border-2 border-white rounded p-1 text-white" : ""}`}
        >
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
            Freelance Platform
          </Typography>
        </Link>

        <div className="flex gap-4">
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : user ? (
            <Link href="/profile" passHref className={`link ${pathname === "/profile" ? "border-2 border-white rounded p-1 text-white" : ""}`}>
              <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
                {user.name || user.email}
              </Typography>
            </Link>
          ) : (
            <>
              <Link href="/login" passHref className={`link ${pathname === "/login" ? "border-2 border-white rounded p-1 text-white" : ""}`}>
                <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
                  Вход
                </Typography>
              </Link>
              <Link href="/register" passHref className={`link ${pathname === "/register" ? "border-2 border-white rounded p-1 text-white" : ""}`}>
                <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
                  Регистрация
                </Typography>
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
