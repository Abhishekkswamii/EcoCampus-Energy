import { createTheme, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#38bdf8' : '#1f7a5c' },
      secondary: { main: isDark ? '#22d3ee' : '#1d4ed8' },
      text: {
        primary: isDark ? '#e2e8f0' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
      },
      background: {
        default: isDark ? '#0b1220' : '#eef2f7',
        paper: isDark ? '#0f172a' : '#ffffff',
      },
      divider: alpha(grey[isDark ? 500 : 600], isDark ? 0.32 : 0.18),
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
            border: `1px solid ${alpha(grey[isDark ? 800 : 300], isDark ? 0.6 : 0.6)}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(grey[isDark ? 800 : 300], isDark ? 0.6 : 0.6)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha(grey[isDark ? 800 : 300], isDark ? 0.7 : 0.7)}`,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(grey[isDark ? 800 : 300], isDark ? 0.7 : 0.7)}`,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderColor: alpha(grey[isDark ? 800 : 300], isDark ? 0.7 : 0.7),
          },
        },
      },
    },
  });
};

