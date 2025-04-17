"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setProfile } from "@/features/profileSlice";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          dispatch(setProfile(data));
        }
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
      }
    }
    fetchProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(setProfile(null));
      router.push("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between items-center">
        {/* Логотип/название платформы */}
        <Link
          href="/"
          passHref
          className={`link ${
            pathname === "/"
              ? "border-2 border-white rounded p-1 text-white"
              : ""
          }`}
        >
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
            Freelance Platform
          </Typography>
        </Link>

        <div className="flex gap-4">
          {profile ? (
            <>
              <Link
                href="/profile"
                passHref
                className={`link ${
                  pathname === "/profile"
                    ? "border-2 border-white rounded p-1 text-white"
                    : ""
                }`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {profile.avatar && (
                    <Box sx={{ position: 'relative', width: 32, height: 32 }}>
                    <Image
                        src={profile.avatar}
                        alt="Аватар"
                        fill
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                    </Box>
                  )}
                  <Typography
                    variant="h6"
                  component="div"
                  sx={{ cursor: "pointer" }}
                >
                  {profile.name || profile.email}
                  </Typography>
                </Box>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                passHref
                className={`link ${
                  pathname === "/login"
                    ? "border-2 border-white rounded p-1 text-white"
                    : ""
                }`}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ cursor: "pointer" }}
                >
                  Вход
                </Typography>
              </Link>
              <Link
                href="/register"
                passHref
                className={`link ${
                  pathname === "/register"
                    ? "border-2 border-white rounded p-1 text-white"
                    : ""
                }`}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ cursor: "pointer" }}
                >
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
