import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import Header from './Header';
import { formatAlertType } from '../utils/alertFeed';

const rangeOptions = [
  { id: '24h', label: 'Last 24 hours', hours: 24 },
  { id: '7d', label: 'Last 7 days', hours: 24 * 7 },
  { id: '30d', label: 'Last 30 days', hours: 24 * 30 },
  { id: 'all', label: 'All history', hours: null },
];

const Alerts = ({
  activeView = 'alerts',
  onViewChange,
  alertFeed = [],
  themeMode,
  onToggleTheme,
}) => {
  const [scopeFilter, setScopeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [rangeFilter, setRangeFilter] = useState('7d');
  const [search, setSearch] = useState('');

  const actionPlaybook = useMemo(
    () => ({
      spike: [
        'Confirm meter readings and isolate the affected zone.',
        'Throttle high-draw equipment for 30-60 minutes.',
        'Schedule a follow-up inspection during peak hour.',
      ],
      'after-hours': [
        'Check idle HVAC and lighting schedules for overrides.',
        'Shut down non-critical loads after closing time.',
        'Notify facilities if usage persists overnight.',
      ],
      'wasteful-pattern': [
        'Audit equipment with steady overnight draw.',
        'Reduce base load with power management profiles.',
        'Plan a maintenance window for aging devices.',
      ],
      default: [
        'Verify the sensor stream for anomalies.',
        'Escalate to facilities if pattern repeats.',
      ],
    }),
    []
  );

  const locations = useMemo(() => {
    const names = Array.from(new Set(alertFeed.map((alert) => alert.location).filter(Boolean)));
    return names.sort((a, b) => a.localeCompare(b));
  }, [alertFeed]);

  const filteredAlerts = useMemo(() => {
    const now = Date.now();
    const rangeHours = rangeOptions.find((option) => option.id === rangeFilter)?.hours ?? null;
    const since = rangeHours ? now - rangeHours * 60 * 60 * 1000 : null;

    return alertFeed.filter((alert) => {
      if (scopeFilter !== 'all' && alert.scope !== scopeFilter) {
        return false;
      }
      if (severityFilter !== 'all' && alert.severity !== severityFilter) {
        return false;
      }
      if (typeFilter !== 'all' && alert.type !== typeFilter) {
        return false;
      }
      if (locationFilter !== 'all' && alert.location !== locationFilter) {
        return false;
      }
      if (since) {
        const alertTime = new Date(alert.timestamp).getTime();
        if (Number.isNaN(alertTime) || alertTime < since) {
          return false;
        }
      }
      if (search) {
        const haystack = `${alert.message} ${alert.location} ${alert.type}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [alertFeed, locationFilter, rangeFilter, scopeFilter, search, severityFilter, typeFilter]);

  const escapeCsv = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    const text = String(value);
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleExportCsv = () => {
    const header = ['timestamp', 'location', 'type', 'severity', 'scope', 'message'];
    const rows = filteredAlerts.map((alert) => [
      alert.timestamp,
      alert.location,
      formatAlertType(alert.type),
      alert.severity,
      alert.scope,
      alert.message,
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alerts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const stats = useMemo(() => {
    const total = filteredAlerts.length;
    const high = filteredAlerts.filter((alert) => alert.severity === 'high').length;
    const spikes = filteredAlerts.filter((alert) => alert.type === 'spike').length;
    const afterHours = filteredAlerts.filter((alert) => alert.type === 'after-hours').length;
    return { total, high, spikes, afterHours };
  }, [filteredAlerts]);

  const actionSummary = useMemo(() => {
    if (!filteredAlerts.length) {
      return {
        topLocation: 'No alerts yet',
        topType: 'N/A',
        peakSpikeHour: 'N/A',
        highestLoad: 'N/A',
        steps: actionPlaybook.default,
      };
    }

    const locationCounts = {};
    const typeCounts = {};
    const loadByLocation = {};

    filteredAlerts.forEach((alert) => {
      if (alert.location) {
        locationCounts[alert.location] = (locationCounts[alert.location] || 0) + 1;
      }
      if (alert.type) {
        typeCounts[alert.type] = (typeCounts[alert.type] || 0) + 1;
      }
      if (typeof alert.consumption === 'number' && alert.location) {
        const entry = loadByLocation[alert.location] || { total: 0, count: 0 };
        entry.total += alert.consumption;
        entry.count += 1;
        loadByLocation[alert.location] = entry;
      }
    });

    const topLocation = Object.keys(locationCounts).sort(
      (a, b) => locationCounts[b] - locationCounts[a]
    )[0];

    const topType = Object.keys(typeCounts).sort(
      (a, b) => typeCounts[b] - typeCounts[a]
    )[0];

    let highestLoad = 'N/A';
    const loadEntries = Object.entries(loadByLocation);
    if (loadEntries.length) {
      const [location, stats] = loadEntries.sort((a, b) => {
        const avgA = a[1].total / a[1].count;
        const avgB = b[1].total / b[1].count;
        return avgB - avgA;
      })[0];
      const avg = stats.total / stats.count;
      highestLoad = `${location} (${avg.toFixed(1)} kWh avg)`;
    }

    const spikeAlerts = filteredAlerts.filter((alert) => alert.type === 'spike');
    const hourCounts = {};
    spikeAlerts.forEach((alert) => {
      const time = new Date(alert.timestamp);
      if (!Number.isNaN(time.getTime())) {
        const hour = time.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    let peakSpikeHour = 'N/A';
    const hours = Object.keys(hourCounts);
    if (hours.length) {
      const peakHour = Number(
        hours.sort((a, b) => hourCounts[b] - hourCounts[a])[0]
      );
      peakSpikeHour = `${String(peakHour).padStart(2, '0')}:00`;
    }

    const steps = actionPlaybook[topType] || actionPlaybook.default;

    return {
      topLocation: topLocation || 'N/A',
      topType: formatAlertType(topType),
      peakSpikeHour,
      highestLoad,
      steps,
    };
  }, [actionPlaybook, filteredAlerts]);

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
        notifications={alertFeed}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary">
                Total alerts
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary">
                High severity
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
                {stats.high}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary">
                Spike alerts
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
                {stats.spikes}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary">
                After-hours
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
                {stats.afterHours}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Action Suggestions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                Focus areas and quick actions based on the current alert window.
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Highest load: <strong>{actionSummary.highestLoad}</strong>
                </Typography>
                <Typography variant="body2">
                  Most affected location: <strong>{actionSummary.topLocation}</strong>
                </Typography>
                <Typography variant="body2">
                  Top alert type: <strong>{actionSummary.topType}</strong>
                </Typography>
                <Typography variant="body2">
                  Peak spike hour: <strong>{actionSummary.peakSpikeHour}</strong>
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Recommended next steps
              </Typography>
              <Stack spacing={0.75}>
                {actionSummary.steps.map((step, index) => (
                  <Typography key={step} variant="body2">
                    {index + 1}. {step}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Narrow down alerts by scope, severity, type, and time window.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Scope
                </Typography>
                <Select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="campus">Campus</MenuItem>
                  <MenuItem value="building">Building</MenuItem>
                  <MenuItem value="room">Room</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Severity
                </Typography>
                <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Type
                </Typography>
                <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="spike">Spike</MenuItem>
                  <MenuItem value="after-hours">After-hours</MenuItem>
                  <MenuItem value="wasteful-pattern">Wasteful</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Location
                </Typography>
                <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Time window
                </Typography>
                <Select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)}>
                  {rangeOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                fullWidth
                placeholder="Search by message, location, or type"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2, gap: 2 }}>
            <Box>
              <Typography variant="h6">Alert History</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {filteredAlerts.length} alert(s) in the selected window.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="High" color="error" size="small" />
              <Chip label="Medium" color="warning" size="small" />
              <Chip label="Low" color="default" size="small" />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" startIcon={<DownloadRoundedIcon />} onClick={handleExportCsv}>
              Export CSV
            </Button>
            <Button variant="outlined" size="small" startIcon={<PrintRoundedIcon />} onClick={handlePrintPdf}>
              Print PDF
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>Location</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>Type</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>Severity</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts.length ? (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{alert.location}</TableCell>
                      <TableCell>{formatAlertType(alert.type)}</TableCell>
                      <TableCell>
                        <Chip
                          label={alert.severity}
                          size="small"
                          color={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{alert.message}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No alerts match the current filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default Alerts;
