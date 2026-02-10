import React from 'react';
import { Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

const ViewSelector = ({ selectedView, onViewChange }) => {
  const views = [
    { id: 'hourly', label: 'Hourly', icon: <AccessTimeRoundedIcon fontSize="small" /> },
    { id: 'daily', label: 'Daily', icon: <CalendarMonthRoundedIcon fontSize="small" /> },
    { id: 'weekly', label: 'Weekly', icon: <DateRangeRoundedIcon fontSize="small" /> },
    { id: 'monthly', label: 'Monthly', icon: <InsightsRoundedIcon fontSize="small" /> },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">
          Time View
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedView}
          onChange={(_, next) => next && onViewChange(next)}
          fullWidth
          size="small"
        >
          {views.map((view) => (
            <ToggleButton key={view.id} value={view.id} sx={{ gap: 0.75 }}>
              {view.icon}
              {view.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
};

export default ViewSelector;
