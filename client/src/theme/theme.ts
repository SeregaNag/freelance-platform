import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface Palette {
    customStatus: {
      completed: string;
      pending: string;
      canceled: string;
    };
  }
  interface PaletteOptions {
    customStatus?: {
      completed?: string;
      pending?: string;
      canceled?: string;
    };
  }
}

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#F50057',
      light: '#FF4081',
      dark: '#C51162',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#546E7A',
    },
    customStatus: {
      completed: "#4CAF50",
      pending: "#FF9800",
      canceled: "#F44336",
    },
  },
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      light: '#BBDEFB',
      dark: '#42A5F5',
    },
    secondary: {
      main: '#F48FB1',
      light: '#F8BBD0',
      dark: '#EC407A',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  components: {
    ...commonTheme.components,
    MuiButton: {
      styleOverrides: {
        ...commonTheme.components?.MuiButton?.styleOverrides,
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        ...commonTheme.components?.MuiCard?.styleOverrides,
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  },
});
