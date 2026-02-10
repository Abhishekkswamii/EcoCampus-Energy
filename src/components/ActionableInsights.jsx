import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';

const InsightItem = ({ icon, title, description, type, bullets }) => {
  const getColor = () => {
    if (type === 'warning') return '#f59e0b';
    if (type === 'savings') return '#10b981';
    return '#3b82f6';
  };

  const color = getColor();

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
        {React.cloneElement(icon, {
          sx: { fontSize: 20, color: color, mt: 0.25 },
        })}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
          {bullets && bullets.length > 0 && (
            <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
              {bullets.map((bullet, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: 12,
                    lineHeight: 1.6,
                    mb: 0.5,
                  }}
                >
                  {bullet}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ActionableInsights = () => {
  const insights = [
    {
      icon: <WarningRoundedIcon />,
      title: 'High Usage After Hours',
      description:
        'Systems are using 30% or more energy outside working hours. This suggests equipment may be left running overnight.',
      type: 'warning',
      bullets: [
        'Check schedules and consider automatic shutdown systems.',
        'Audit for non-essential equipment running 24/7.',
      ],
    },
    {
      icon: <TrendingDownRoundedIcon />,
      title: 'Energy Savings Opportunity',
      description:
        'By optimizing schedules and reducing idle time, you could save approximately 225 kWh per day.',
      type: 'savings',
      bullets: [
        'Target the highest-consuming buildings and implement smart scheduling.',
      ],
    },
  ];

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: '#1a1f35',
        border: '1px solid rgba(255, 255, 255, 0.05)',
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <LightbulbRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
          Actionable Insights
        </Typography>
      </Box>

      <Stack spacing={0}>
        {insights.map((insight, index) => (
          <InsightItem
            key={index}
            icon={insight.icon}
            title={insight.title}
            description={insight.description}
            type={insight.type}
            bullets={insight.bullets}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default ActionableInsights;
