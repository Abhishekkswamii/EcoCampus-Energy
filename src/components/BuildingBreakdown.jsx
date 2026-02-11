import React from 'react';
import { Box, Paper, Typography, LinearProgress, Stack } from '@mui/material';

const BuildingItem = ({ name, consumption, maxConsumption, color }) => {
  const percentage = (consumption / maxConsumption) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 500 }}>
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
          bgcolor: 'rgba(148, 163, 184, 0.3)',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 4,
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
        p: 3,
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(148, 163, 184, 0.4)',
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 24,
            bgcolor: 'primary.main',
            borderRadius: 1,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
          Building Breakdown
        </Typography>
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
