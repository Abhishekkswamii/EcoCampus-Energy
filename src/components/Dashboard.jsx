import React, { useState, useEffect } from 'react';
import Header from './Header';
import StackedAreaChart from './StackedAreaChart';
import BuildingBreakdown from './BuildingBreakdown';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { ENERGY_DATA, aggregateByCampus } from '../data/energyData';
import { detectAnomalies, getUsageSummary } from '../utils/detectionLogic';

const Dashboard = ({
  activeView = 'dashboard',
  onViewChange,
  alertFeed = [],
  energyData = [],
  themeMode,
  onToggleTheme,
}) => {
  // State management
  const [view, setView] = useState('hourly'); // hourly, daily, weekly, monthly
  
  // Computed data
  const [filteredData, setFilteredData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  
  // Filter and process data based on selections
  useEffect(() => {
    const dataset = energyData.length ? energyData : ENERGY_DATA;
    
    // Aggregate all data by timestamp for campus-wide view
    const data = aggregateByCampus(dataset);
    
    // Detect anomalies
    const detectedAlerts = detectAnomalies(data);
    setAlerts(detectedAlerts);
    
    // Calculate summary
    const usageSummary = getUsageSummary(data, dataset, 'campus');
    setSummary(usageSummary);
    
    setFilteredData(data);
  }, [energyData]);
  
  const currentLoad = summary?.total ? Math.round(summary.total) : 653;
  const averageLoad = summary?.average ? Math.round(summary.average) : 627;
  const usdToInr = 82.5;
  const ratePerKwhInr = 0.15 * usdToInr;
  const dailyCost = ((summary?.total || 653) * ratePerKwhInr).toFixed(2);

  const headerAlerts = alertFeed.length ? alertFeed : alerts;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: (t) =>
          t.palette.mode === 'dark'
            ? 'repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.1) 0, rgba(148, 163, 184, 0.1) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.1) 0, rgba(148, 163, 184, 0.1) 1px, transparent 1px, transparent 26px), radial-gradient(circle at 18% 12%, rgba(30, 41, 59, 0.45), transparent 58%), linear-gradient(180deg, #0f172a 0%, #162033 100%)'
            : 'repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.12) 0, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.12) 0, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 26px), radial-gradient(circle at 18% 12%, rgba(15, 23, 42, 0.08), transparent 45%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Header
        activeView={activeView}
        onViewChange={onViewChange}
        notifications={headerAlerts}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 3,
          px: { xs: 2, md: 3, lg: 4 },
          width: '100%',
        }}
      >
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            bgcolor: (t) => (t.palette.mode === 'dark' ? '#0b1220' : '#f8fafc'),
            color: 'text.primary',
            border: (t) =>
              t.palette.mode === 'dark'
                ? '1px solid rgba(30, 41, 59, 0.9)'
                : '1px solid rgba(148, 163, 184, 0.4)',
            boxShadow: (t) =>
              t.palette.mode === 'dark'
                ? '0 24px 60px rgba(15, 23, 42, 0.4)'
                : '0 18px 34px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.6 }}>
                    Operations Console
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 700 }}>
                    Campus Energy Control Room
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                    Live telemetry across campus systems with anomaly detection enabled.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {['System: Live', 'Scope: Campus', 'Window: 24h'].map((label) => (
                    <Box
                      key={label}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        border: (t) =>
                          t.palette.mode === 'dark'
                            ? '1px solid rgba(148, 163, 184, 0.35)'
                            : '1px solid rgba(15, 23, 42, 0.12)',
                        bgcolor: (t) =>
                          t.palette.mode === 'dark'
                            ? 'rgba(15, 23, 42, 0.6)'
                            : 'rgba(226, 232, 240, 0.8)',
                        fontSize: 12,
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      fontWeight: 700,
                    }}
                  >
                    View Usage
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      px: 3,
                      borderColor: 'divider',
                      color: 'text.primary',
                      fontWeight: 600,
                      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                    }}
                  >
                    Export Report
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle2" sx={{ letterSpacing: 1, color: 'text.secondary' }}>
                  Live Metrics
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (t) =>
                        t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#eef2f7',
                      border: (t) =>
                        t.palette.mode === 'dark'
                          ? '1px solid rgba(148, 163, 184, 0.2)'
                          : '1px solid rgba(148, 163, 184, 0.35)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Current Load
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {currentLoad} kWh
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Avg {averageLoad} kWh
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (t) =>
                        t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#eef2f7',
                      border: (t) =>
                        t.palette.mode === 'dark'
                          ? '1px solid rgba(148, 163, 184, 0.2)'
                          : '1px solid rgba(148, 163, 184, 0.35)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Daily Cost
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                      ₹{dailyCost}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Estimated at rate
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (t) =>
                        t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#eef2f7',
                      border: (t) =>
                        t.palette.mode === 'dark'
                          ? '1px solid rgba(148, 163, 184, 0.2)'
                          : '1px solid rgba(148, 163, 184, 0.35)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Active Alerts
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {alerts.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Monitoring in progress
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mt: 0.5 }} alignItems="stretch">
          <Grid item xs={12} md={12} lg={10} xl={10}>
            <StackedAreaChart view={view} height={380}/>
          </Grid>
          <Grid item xs={12} md={12} lg={2} xl={2}>
            <BuildingBreakdown data={filteredData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;