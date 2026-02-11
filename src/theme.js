import { createTheme, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f7a5c' },
    secondary: { main: '#1d4ed8' },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    background: {
      default: '#eef2f7',
      paper: '#ffffff',
    },
    divider: alpha(grey[600], 0.18),
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: [
      'DM Sans',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: -0.4 },
    h5: { fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: -0.3 },
    h6: { fontFamily: 'Fraunces, serif', fontWeight: 600, letterSpacing: -0.2 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha(grey[300], 0.6)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(grey[300], 0.6)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha(grey[300], 0.7)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(grey[300], 0.7)}`,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: alpha(grey[300], 0.7),
        },
      },
    },
  },
});

