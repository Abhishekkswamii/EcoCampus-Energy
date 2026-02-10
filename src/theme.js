import { createTheme, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#10b981' },
    secondary: { main: '#3b82f6' },
    background: {
      default: '#0a0e1a',
      paper: '#1a1f35',
    },
    divider: alpha(grey[700], 0.12),
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 800, letterSpacing: -0.5 },
    h6: { fontWeight: 700, letterSpacing: -0.2 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(grey[900], 0.08)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

