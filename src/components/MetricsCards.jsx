import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const MetricCard = ({ icon, title, value, subtitle, trend, trendValue, iconBg, iconColor }) => {
  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 90,
        width: '100%',
      }}
    >
      <Stack spacing={1}>
        {/* Icon */}
        <Box
          sx={{
            width: 36,
            height: 26,
            borderRadius: 2,
            bgcolor: iconBg || 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, {
            sx: { fontSize: 18, color: iconColor || 'primary.main' },
          })}
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: 26,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: 11,
                display: 'block',
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Trend */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend === 'up' ? (
              <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#ef4444' }} />
            ) : (
              <TrendingDownRoundedIcon sx={{ fontSize: 16, color: '#10b981' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: trend === 'up' ? '#ef4444' : '#10b981',
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

const MetricsCards = ({ summary, alerts }) => {
  if (!summary) return null;

  // Calculate metrics
  const currentLoad = summary.total || 653;
  const averageLoad = summary.average || 627;
  const changePercent = (((currentLoad - averageLoad) / averageLoad) * 100).toFixed(1);
  const usdToInr = 82.5;
  const ratePerKwhInr = 0.15 * usdToInr; // Assuming $0.15 per kWh
  const dailyCost = (currentLoad * ratePerKwhInr).toFixed(2);
  const projectedCost = (dailyCost * 1.2).toFixed(2);
  const activeAlerts = alerts?.length || 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
        justifyItems: 'stretch',
        gap: 2.5,
      }}
    >
      <MetricCard
        icon={<BoltRoundedIcon />}
        title="Current Load"
        value={`${Math.round(currentLoad)} kWh`}
        subtitle={`${changePercent > 0 ? '+' : ''}${changePercent}% from average`}
        trend={changePercent > 0 ? 'up' : 'down'}
        trendValue={`${Math.abs(changePercent)}%`}
        iconBg="rgba(16, 185, 129, 0.1)"
        iconColor="#10b981"
      />

      <MetricCard
        icon={<AttachMoneyRoundedIcon />}
        title="Daily Cost"
        value={`₹${dailyCost}`}
        subtitle={`Projected: ₹${projectedCost}`}
        iconBg="rgba(249, 115, 22, 0.1)"
        iconColor="#f97316"
      />

      <MetricCard
        icon={<WarningRoundedIcon />}
        title="Active Alerts"
        value={activeAlerts}
        subtitle={activeAlerts > 0 ? 'Unusual usage detected' : 'All systems normal'}
        iconBg="rgba(239, 68, 68, 0.1)"
        iconColor="#ef4444"
      />
    </Box>
  );
};

export default MetricsCards;
