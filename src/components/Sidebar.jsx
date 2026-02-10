import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

const Sidebar = ({ activeView = 'dashboard', onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChartRoundedIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsRoundedIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#141928',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BoltRoundedIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
          EcoCampus
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeView === item.id}
              onClick={() => onViewChange?.(item.id)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(16, 185, 129, 0.16)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: activeView === item.id ? 'primary.main' : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: activeView === item.id ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
