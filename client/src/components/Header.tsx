"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setProfile } from "@/features/profileSlice";
import { logout } from "@/features/authSlice";
import ThemeSwitch from './ThemeSwitch';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

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
      dispatch(logout());
      router.push("/login");
      handleClose();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleClose();
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              Freelance Platform
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitch />
            
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ 
                      p: 0,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    {profile?.avatar ? (
                      <Avatar 
                        src={profile.avatar} 
                        alt={user?.name || ''} 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        {(user?.name || 'U')[0].toUpperCase()}
                      </Avatar>
                    )}
                  </IconButton>
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    Выйти
                  </Button>
                </Box>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfileClick}>Профиль</MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    Войти
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button 
                    color="primary" 
                    variant="contained"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
