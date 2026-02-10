import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

const NotificationBell = ({ notifications, isOpen, onToggle }) => {
  const list = Array.isArray(notifications) ? notifications : [];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 72,
        right: 16,
        zIndex: 1400,
        width: 420,
        maxWidth: 'calc(100vw - 32px)',
        display: isOpen && list.length > 0 ? 'block' : 'none',
      }}
    >
      <Paper
        elevation={16}
        sx={{
          overflow: 'hidden',
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Notifications
          </Typography>
          <Chip size="small" label={list.length} color="error" />
        </Box>
        <Divider />

        <List dense sx={{ maxHeight: 420, overflow: 'auto' }}>
          {list.map((notif, index) => {
            const high = notif.severity === 'high';
            return (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                  {high ? (
                    <ErrorRoundedIcon color="error" fontSize="small" />
                  ) : (
                    <WarningAmberRoundedIcon color="warning" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {notif.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notif.location}
                      {' • '}
                      {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now'}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Divider />
        <Box sx={{ p: 1.25, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onToggle} size="small">
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotificationBell;
