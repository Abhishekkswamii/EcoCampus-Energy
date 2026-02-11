import React from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Logo from './Logo';

const Header = ({ notifications, onNotificationClick, activeView, onViewChange }) => {
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
        backgroundColor: 'rgba(248, 250, 252, 0.82)',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
        </Box>

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
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 13 }}>SG</Avatar>
        </Stack>
        </Toolbar>

      </Box>
    </AppBar>
  );
};

export default Header;
