import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Alert,
  AlertTitle,
  Paper,
  Divider,
  Stack
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
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { pageBackground } from '../utils/layoutStyles';
import { campusStructure } from '../data/campusStructure';
import {
  aggregateByTimeRange,
  filterByBuilding,
  filterByRoom,
  prepareChartData,
  getSummaryStats,
  compareBuildings
} from '../utils/usageAggregator';
import {
  detectAllAnomalies,
  getWasteStatus
} from '../utils/anomalyDetection';
import {
  generateInsightsFromAnomalies,
  generateLocationRecommendations,
  calculatePotentialSavings
} from '../utils/insightsEngine';
import Header from './Header';

function Usage({ activeView, onViewChange, alertFeed, themeMode, onToggleTheme, energyData }) {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [timeRange, setTimeRange] = useState('daily');

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = energyData;
    data = filterByBuilding(data, selectedBuilding);
    data = filterByRoom(data, selectedRoom);
    return data;
  }, [energyData, selectedBuilding, selectedRoom]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return prepareChartData(filteredData, timeRange);
  }, [filteredData, timeRange]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return getSummaryStats(filteredData, timeRange);
  }, [filteredData, timeRange]);

  // Detect anomalies
  const anomalyResult = useMemo(() => {
    return detectAllAnomalies(filteredData);
  }, [filteredData]);

  // Waste status
  const wasteStatus = useMemo(() => {
    return getWasteStatus(filteredData);
  }, [filteredData]);

  // Get highest consuming building
  const buildingComparison = useMemo(() => {
    return compareBuildings(energyData, timeRange);
  }, [energyData, timeRange]);

  const highestBuilding = buildingComparison.length > 0 ? buildingComparison[0] : null;

  // Generate insights
  const insights = useMemo(() => {
    return generateInsightsFromAnomalies(anomalyResult, summaryStats);
  }, [anomalyResult, summaryStats]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    return generateLocationRecommendations(selectedBuilding, selectedRoom, campusStructure);
  }, [selectedBuilding, selectedRoom]);

  // Calculate potential savings
  const potentialSavings = useMemo(() => {
    if (anomalyResult.hasAnomalies) {
      return calculatePotentialSavings(anomalyResult);
    }
    return null;
  }, [anomalyResult]);

  // Get available rooms based on selected building
  const availableRooms = useMemo(() => {
    if (selectedBuilding === 'all') return [];
    const building = campusStructure.buildings.find(b => b.id === selectedBuilding);
    return building ? building.rooms : [];
  }, [selectedBuilding]);

  // Format timestamp for chart
  const formatTimestamp = (timestamp) => {
    if (timeRange === 'hourly') {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (timeRange === 'daily') {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (timeRange === 'weekly') {
      return `Week ${timestamp}`;
    }
    if (timeRange === 'monthly') {
      const [year, month] = timestamp.split('-');
      return new Date(year, month - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }
    return timestamp;
  };

  // Find peak usage time
  const peakUsageTime = useMemo(() => {
    if (!summaryStats.peakTime) return 'N/A';
    return formatTimestamp(summaryStats.peakTime);
  }, [summaryStats, timeRange]);

  return (
    <Box sx={pageBackground}>
      <Header
        activeView={activeView}
        onViewChange={onViewChange}
        alertFeed={alertFeed}
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Energy Usage Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed consumption patterns, anomaly detection, and actionable insights
          </Typography>
        </Box>

        {/* Overview Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Energy
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {summaryStats.totalEnergy.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  kWh ({timeRange})
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Highest Consuming
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary" noWrap>
                  {highestBuilding ? highestBuilding.buildingName : 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {highestBuilding ? `${highestBuilding.consumption.toLocaleString()} kWh` : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Peak Usage Time
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {peakUsageTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {summaryStats.peakUsage.toLocaleString()} kWh
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Waste Status
                </Typography>
                <Chip
                  label={wasteStatus.status}
                  color={wasteStatus.color}
                  sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  {wasteStatus.message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Building</InputLabel>
                <Select
                  value={selectedBuilding}
                  label="Building"
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setSelectedRoom('all');
                  }}
                >
                  <MenuItem value="all">All Buildings</MenuItem>
                  {campusStructure.buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" disabled={selectedBuilding === 'all'}>
                <InputLabel>Room</InputLabel>
                <Select
                  value={selectedRoom}
                  label="Room"
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  <MenuItem value="all">All Rooms</MenuItem>
                  {availableRooms.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ToggleButtonGroup
                  value={timeRange}
                  exclusive
                  onChange={(e, newValue) => newValue && setTimeRange(newValue)}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="hourly">Hourly</ToggleButton>
                  <ToggleButton value="daily">Daily</ToggleButton>
                  <ToggleButton value="weekly">Weekly</ToggleButton>
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Energy Trend Chart */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Energy Consumption Trend
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                labelFormatter={formatTimestamp}
                formatter={(value) => [`${value.toLocaleString()} kWh`, 'Consumption']}
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="#8884d8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConsumption)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Abnormal Usage Detection */}
        {anomalyResult.hasAnomalies && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="error">
              ⚠️ Abnormal Usage Detected
            </Typography>
            <Stack spacing={2}>
              {anomalyResult.anomalies.map((anomaly, index) => (
                <Alert key={index} severity={anomaly.severity === 'high' ? 'error' : 'warning'}>
                  <AlertTitle>{anomaly.message}</AlertTitle>
                  <Typography variant="body2" gutterBottom>
                    <strong>Impact:</strong> {anomaly.totalWaste || anomaly.extraConsumption} kWh wasted ≈ ₹
                    {anomaly.estimatedCost}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Action:</strong> {anomaly.recommendation}
                  </Typography>
                </Alert>
              ))}
            </Stack>

            {potentialSavings && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>Potential Savings</AlertTitle>
                <Typography variant="body2">{potentialSavings.message}</Typography>
              </Alert>
            )}
          </Paper>
        )}

        {/* Insights & Recommendations Section */}
        <Grid container spacing={3}>
          {/* Insights */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                💡 Key Insights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {insights.map((insight, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h5" sx={{ mr: 1 }}>
                          {insight.icon}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {insight.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Finding:</strong> {insight.finding}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Impact:</strong> {insight.impact}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        <strong>Action:</strong> {insight.action}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                🎯 Recommendations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recommendations.map((rec, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ mr: 1 }}>
                      {rec.icon}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {rec.title}
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {rec.tips.map((tip, tipIndex) => (
                      <Box key={tipIndex} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="body2" sx={{ mr: 1, color: 'primary.main' }}>
                          •
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tip}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Usage;
