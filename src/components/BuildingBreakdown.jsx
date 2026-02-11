import React from 'react';
import { Box, Paper, Typography, LinearProgress, Stack } from '@mui/material';

const BuildingItem = ({ name, consumption, maxConsumption, color }) => {
  const percentage = (consumption / maxConsumption) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 600 }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 700 }}>
          {consumption} kWh
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: (t) =>
            t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(148, 163, 184, 0.3)',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 4,
            boxShadow: (t) => (t.palette.mode === 'dark' ? `0 0 10px ${color}66` : 'none'),
          },
        }}
      />
    </Box>
  );
};

const BuildingBreakdown = ({ data }) => {
  // Extract building-level data
  const buildingData = [
    { name: 'Main Library', consumption: 183, color: '#3b82f6' },
    { name: 'Student Dorms', consumption: 317, color: '#10b981' },
    { name: 'Admin Building', consumption: 71, color: '#f97316' },
    { name: 'Central Cafeteria', consumption: 82, color: '#ef4444' },
  ];

  const maxConsumption = Math.max(...buildingData.map((b) => b.consumption));

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        height: '60%',
        minHeight: 350,
        width: '300%',
        borderRadius: 3,
        bgcolor: (t) => (t.palette.mode === 'dark' ? '#0f172a' : '#f8fafc'),
        color: 'text.primary',
        border: (t) =>
          t.palette.mode === 'dark'
            ? '1px solid rgba(30, 41, 59, 0.9)'
            : '1px solid rgba(148, 163, 184, 0.45)',
        boxShadow: (t) =>
          t.palette.mode === 'dark'
            ? '0 22px 40px rgba(15, 23, 42, 0.4)'
            : '0 18px 34px rgba(15, 23, 42, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2.5,
          pb: 2,
          borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ letterSpacing: 1.6, color: 'text.secondary' }}>
            Consumption Share
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary' }}>
            Building Breakdown
          </Typography>
        </Box>
      </Box>

      <Stack spacing={0}>
        {buildingData.map((building, index) => (
          <BuildingItem
            key={index}
            name={building.name}
            consumption={building.consumption}
            maxConsumption={maxConsumption}
            color={building.color}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default BuildingBreakdown;
