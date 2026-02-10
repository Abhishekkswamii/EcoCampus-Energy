import React from 'react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

const Header = ({ notifications, onNotificationClick }) => {
  const count = Array.isArray(notifications) ? notifications.length : 0;

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(246, 248, 251, 0.8)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: (t) => `0 10px 30px ${t.palette.primary.main}33`,
            }}
          >
            <BoltRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              Smart Campus Energy Monitor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time energy insights for Green Valley University
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onNotificationClick} aria-label="Notifications">
          <Badge color="error" badgeContent={count} max={99}>
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
