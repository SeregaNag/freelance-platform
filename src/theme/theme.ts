import { createTheme, PaletteOptions } from "@mui/material";

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

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    secondary: {
      main: "#FF9800",
    },
    customStatus: {
      completed: "#4CAF50",
      pending: "#FF9800",
      canceled: "#F44336",
    },
  },
});
