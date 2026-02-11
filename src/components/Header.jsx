import React from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import Logo from './Logo';

const Header = ({
  notifications,
  onNotificationClick,
  activeView,
  onViewChange,
  themeMode = 'light',
  onToggleTheme,
}) => {
  const count = Array.isArray(notifications) ? notifications.length : 0;
  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'analytics', label: 'Usage' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'settings', label: 'Service' },
  ];

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.82)',
      }}
    >
      <Box sx={{ maxWidth: 1240, width: '100%', mx: 'auto' }}>
        <Toolbar
          sx={{
            width: '100%',
            py: 1.25,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
        <ButtonBase
          onClick={() => onViewChange?.('dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textAlign: 'left',
            borderRadius: 2,
            px: 0.5,
            py: 0.25,
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 6px 14px rgba(15, 23, 42, 0.16)',
            },
            '&:focus-visible': {
              outline: '2px solid rgba(37, 99, 235, 0.6)',
              outlineOffset: 2,
            },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              boxShadow: (t) => `0 12px 30px ${t.palette.primary.main}33`,
            }}
          >
            <Logo size={34} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              WattWise
            </Typography>
            <Typography variant="caption" color="text.secondary">
              See the Power. Stop the Waste.
            </Typography>
          </Box>
        </ButtonBase>

        <Stack
          direction="row"
          spacing={1}
          sx={{ flex: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}
        >
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onViewChange?.(item.id)}
              variant={activeView === item.id ? 'contained' : 'text'}
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 999,
                px: 2,
                minHeight: 36,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            label="Language"
            size="small"
            variant="outlined"
            sx={{ borderRadius: 999, fontWeight: 600 }}
          />
          <IconButton onClick={onNotificationClick} aria-label="Notifications">
            <Badge color="error" badgeContent={count} max={99}>
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
          <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={onToggleTheme} aria-label="Toggle theme">
              {themeMode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 13 }}>SG</Avatar>
        </Stack>
        </Toolbar>

      </Box>
    </AppBar>
  );
};

export default Header;
