'use client';

import { ThemeProvider } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { lightTheme, darkTheme } from '@/theme/theme';
import { useEffect } from 'react';
import { setThemeMode } from '@/features/themeSlice';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

export default function Providers({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as 'light' | 'dark';
    if (savedTheme) {
      dispatch(setThemeMode(savedTheme));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3} 
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
} 