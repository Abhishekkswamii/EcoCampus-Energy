import React, { useMemo, useState } from 'react';
import Header from './Header';
import analyticsData from '../data/analyticsData';
import { pageBackground } from '../utils/layoutStyles';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  Slider,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Analytics = ({
  activeView = 'analytics',
  onViewChange,
  alertFeed = [],
  themeMode,
  onToggleTheme,
}) => {
  const { campus, locations, hourlyTotals, unit, currency } = analyticsData;
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [timeRange, setTimeRange] = useState('hours');
  const [viewMode, setViewMode] = useState('bar');
  const [alertSettings, setAlertSettings] = useState({
    spikeDetection: true,
    afterHours: true,
    occupancy: false,
    threshold: 18,
    notifyInApp: true,
    notifyEmail: false,
    notifySms: false,
  });

  const summaryItems = [
    { label: 'Current Load', value: `${campus.currentLoad} ${unit}` },
    { label: 'Daily Consumption', value: `${campus.dailyConsumption} ${unit}` },
    { label: 'Weekly Consumption', value: `${campus.weeklyConsumption} ${unit}` },
    { label: 'Monthly Consumption', value: `${campus.monthlyConsumption} ${unit}` },
    { label: 'Daily Cost', value: `${currency} ${campus.dailyCost.toFixed(2)}` },
    { label: 'Peak Load', value: `${campus.peakLoad} ${unit}` },
  ];

  const filteredLocations = useMemo(() => {
    if (selectedLocation === 'all') {
      return locations;
    }
    return locations.filter((location) => location.id === selectedLocation);
  }, [locations, selectedLocation]);

  const selectedLocationData = useMemo(() => {
    if (selectedLocation === 'all') {
      return null;
    }
    return locations.find((location) => location.id === selectedLocation) || null;
  }, [locations, selectedLocation]);

  const getPeriodValue = (location) => {
    if (timeRange === 'hours') {
      return `${location.currentLoad} ${unit}`;
    }
    if (timeRange === 'days') {
      return `${location.dailyConsumption} ${unit}`;
    }
    if (timeRange === 'weeks') {
      return `${location.weeklyConsumption} ${unit}`;
    }
    return `${location.monthlyConsumption} ${unit}`;
  };

  const chartData = useMemo(() => {
    const target = selectedLocation === 'all'
      ? { id: 'campus', name: 'Campus', weight: campus.currentLoad }
      : locations.find((location) => location.id === selectedLocation);

    const weight = target ? target.weight || target.currentLoad || campus.currentLoad : campus.currentLoad;
    const campusWeight = campus.currentLoad || 1;
    const scale = weight / campusWeight;

    if (timeRange === 'hours') {
      return hourlyTotals
        .filter((_, index) => index % 3 === 0)
        .map((row) => ({
          label: row.time,
          value: Math.round(row.total * scale),
        }));
    }

    if (timeRange === 'days') {
      const base = Math.round((campus.dailyConsumption || 1) * scale);
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({
        label: day,
        value: Math.round(base * (0.92 + index * 0.03)),
      }));
    }

    if (timeRange === 'weeks') {
      const base = Math.round((campus.weeklyConsumption || 1) * scale / 4);
      return ['W1', 'W2', 'W3', 'W4'].map((week, index) => ({
        label: week,
        value: Math.round(base * (0.95 + index * 0.04)),
      }));
    }

    const base = Math.round((campus.monthlyConsumption || 1) * scale / 12);
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
      (month, index) => ({
        label: month,
        value: Math.round(base * (0.85 + index * 0.03)),
      })
    );
  }, [campus, hourlyTotals, locations, selectedLocation, timeRange]);

  const chartStats = useMemo(() => {
    if (!chartData.length) {
      return { average: 0, peak: 0 };
    }
    const total = chartData.reduce((sum, point) => sum + point.value, 0);
    const peak = chartData.reduce((maxValue, point) => Math.max(maxValue, point.value), 0);
    return { average: total / chartData.length, peak };
  }, [chartData]);

  const spikeThreshold = alertSettings.threshold;
  const anomalyPoints = useMemo(() => {
    if (!alertSettings.spikeDetection || !chartData.length || !chartStats.average) {
      return [];
    }
    const thresholdValue = chartStats.average * (1 + spikeThreshold / 100);
    return chartData.filter((point) => point.value >= thresholdValue);
  }, [alertSettings.spikeDetection, chartData, chartStats.average, spikeThreshold]);

  const alertLocations = useMemo(() => {
    return locations.filter(
      (location) => location.alerts > 0 || location.status === 'watch' || location.trendPercent >= 7
    );
  }, [locations]);

  const comparisonItems = [
    {
      label: 'Today vs Yesterday',
      value: `${Math.round(campus.dailyConsumption * 0.041)} ${unit}`,
      trend: '+4.1%',
    },
    {
      label: 'Week vs Last Week',
      value: `${Math.round(campus.weeklyConsumption * 0.026)} ${unit}`,
      trend: '+2.6%',
    },
    {
      label: 'Month vs Last Month',
      value: `${Math.round(campus.monthlyConsumption * -0.018)} ${unit}`,
      trend: '-1.8%',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <Paper
        elevation={8}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          border: (t) =>
            t.palette.mode === 'dark'
              ? '1px solid rgba(71, 85, 105, 0.6)'
              : '1px solid rgba(148, 163, 184, 0.4)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 600 }}>
          {payload[0].value} {unit}
        </Typography>
      </Paper>
    );
  };

  return (
    <Box sx={pageBackground}>
      <Header
        activeView={activeView}
        onViewChange={onViewChange}
        notifications={alertFeed}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <Box sx={{ py: 3, px: { xs: 2, md: 4 } }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Campus Snapshot
              </Typography>
              <Grid container spacing={2}>
                {summaryItems.map((item) => (
                  <Grid key={item.label} item xs={12} sm={6} md={4} lg={2}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(15, 23, 42, 0.04)',
                        borderRadius: 3,
                        border: '1px solid rgba(148, 163, 184, 0.4)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Location
          </Typography>
          <FormControl fullWidth size="small">
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, fontSize: 11 }}>
              Select location
            </Typography>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              sx={{
                bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#fff'),
              }}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>


        <Paper sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Location Analytics</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Select a location, time range, and view mode.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, fontSize: 11 }}>
                  Time Range
                </Typography>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{
                    bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#fff'),
                  }}
                >
                  <MenuItem value="hours">Hours (3-hr)</MenuItem>
                  <MenuItem value="days">Daily</MenuItem>
                  <MenuItem value="weeks">Weekly</MenuItem>
                  <MenuItem value="months">Monthly</MenuItem>
                </Select>
              </FormControl>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                sx={{
                  borderRadius: 999,
                  bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#fff'),
                }}
              >
                <ToggleButton
                  value="table"
                  sx={{ textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'rgba(31, 122, 92, 0.12)' } }}
                >
                  Table
                </ToggleButton>
                <ToggleButton
                  value="line"
                  sx={{ textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'rgba(31, 122, 92, 0.12)' } }}
                >
                  Line
                </ToggleButton>
                <ToggleButton
                  value="bar"
                  sx={{ textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'rgba(31, 122, 92, 0.12)' } }}
                >
                  Bar
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {viewMode === 'table' ? (
            <TableContainer sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary' }}>Location</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Period Consumption</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Peak Hour</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Alerts</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Trend %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{getPeriodValue(location)}</TableCell>
                      <TableCell>{location.peakHour}</TableCell>
                      <TableCell>{location.alerts}</TableCell>
                      <TableCell>{location.trendPercent}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : viewMode === 'line' ? (
            <Box sx={{ mt: 3 }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                  <XAxis dataKey="label" stroke="rgba(71, 85, 105, 0.8)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(71, 85, 105, 0.8)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ mt: 3 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                  <XAxis dataKey="label" stroke="rgba(71, 85, 105, 0.8)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(71, 85, 105, 0.8)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">Usage Alerts</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Configure spike detection, after-hours rules, and notification channels.
                  </Typography>
                </Box>
                <Divider />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Spike threshold
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {alertSettings.threshold}% above baseline
                    </Typography>
                    <Slider
                      value={alertSettings.threshold}
                      onChange={(_, value) =>
                        setAlertSettings((prev) => ({ ...prev, threshold: Array.isArray(value) ? value[0] : value }))
                      }
                      min={10}
                      max={35}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Stack spacing={1.5} sx={{ minWidth: 220 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.spikeDetection}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, spikeDetection: e.target.checked }))
                          }
                        />
                      }
                      label="Spike detection"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.afterHours}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, afterHours: e.target.checked }))
                          }
                        />
                      }
                      label="After-hours guardrail"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.occupancy}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, occupancy: e.target.checked }))
                          }
                        />
                      }
                      label="Occupancy-aware alerts"
                    />
                  </Stack>
                </Stack>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Notification channels
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.notifyInApp}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, notifyInApp: e.target.checked }))
                          }
                        />
                      }
                      label="In-app"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.notifyEmail}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, notifyEmail: e.target.checked }))
                          }
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.notifySms}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({ ...prev, notifySms: e.target.checked }))
                          }
                        />
                      }
                      label="SMS"
                    />
                  </Stack>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Active alerts
                  </Typography>
                  <List dense sx={{ bgcolor: 'rgba(15, 23, 42, 0.03)', borderRadius: 2 }}>
                    {alertLocations.length ? (
                      alertLocations.map((location) => (
                        <ListItem key={location.id} divider>
                          <ListItemText
                            primary={location.name}
                            secondary={`Peak ${location.peakHour} · ${location.alerts} alerts`}
                          />
                          <Chip
                            label={location.status === 'watch' ? 'Needs review' : 'Monitor'}
                            color={location.status === 'watch' ? 'warning' : 'default'}
                            size="small"
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary="No alerts match current criteria"
                          secondary="Adjust thresholds or select a location to see more detail."
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">Spike Highlights</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {anomalyPoints.length
                      ? 'Unusual spikes detected for the selected range.'
                      : 'No spikes above the current threshold.'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(248, 113, 113, 0.12)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Baseline average: {Math.round(chartStats.average)} {unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Spike threshold: {Math.round(chartStats.average * (1 + spikeThreshold / 100))} {unit}
                  </Typography>
                </Box>
                <List dense>
                  {anomalyPoints.length ? (
                    anomalyPoints.map((point) => (
                      <ListItem key={point.label} divider>
                        <ListItemText
                          primary={`${point.label} · ${point.value} ${unit}`}
                          secondary={`+${Math.round(((point.value - chartStats.average) / chartStats.average) * 100)}% above baseline`}
                        />
                        <Chip label="Spike" color="error" size="small" />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="Stable usage" secondary="No data points exceeded the threshold." />
                    </ListItem>
                  )}
                </List>
                {selectedLocationData && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(148, 163, 184, 0.4)',
                      bgcolor: 'rgba(15, 23, 42, 0.02)',
                    }}
                  >
                    <Typography variant="subtitle2">Location context</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {selectedLocationData.name} averages {selectedLocationData.averageLoad} {unit} with a peak of{' '}
                      {selectedLocationData.peakLoad} {unit} at {selectedLocationData.peakHour}.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;
