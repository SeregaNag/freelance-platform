"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchProfile() {
      try {
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
      }
    }
    fetchProfile();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
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

        {/* Если пользователь авторизован, отображаем его имя или email */}
        {user && (
          <Link href="/profile" passHref className={`link ${pathname === "/profile" ? "border-2 border-white rounded p-1 text-white" : ""}`}>
            <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
              {user.name || user.email}
            </Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
