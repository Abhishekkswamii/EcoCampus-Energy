import React, { useState, useEffect } from 'react';
import Header from './Header';
import MetricsCards from './MetricsCards';
import StackedAreaChart from './StackedAreaChart';
import ActionableInsights from './ActionableInsights';
import BuildingBreakdown from './BuildingBreakdown';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { ENERGY_DATA, aggregateByBuilding, aggregateByCampus } from '../data/energyData';
import { getBuildingById } from '../data/campusStructure';
import { detectAnomalies, getUsageSummary } from '../utils/detectionLogic';
import { generateInsights, generateRecommendations, calculateSavings } from '../utils/insightsEngine';

const Dashboard = ({ activeView = 'dashboard', onViewChange, alertFeed = [], energyData = [] }) => {
  // State management
  const [view, setView] = useState('hourly'); // hourly, daily, weekly, monthly
  const [level, setLevel] = useState('campus'); // campus, building, room
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Computed data
  const [filteredData, setFilteredData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savings, setSavings] = useState(null);
  
  // Filter and process data based on selections
  useEffect(() => {
    const dataset = energyData.length ? energyData : ENERGY_DATA;
    let data = [];
    let locationName = '';
    
    if (level === 'campus') {
      // Aggregate all data by timestamp
      data = aggregateByCampus(dataset);
      locationName = 'Entire Campus';
    } else if (level === 'building' && selectedBuilding) {
      // Filter by building
      const building = getBuildingById(selectedBuilding);
      const buildingRoomIds = building.rooms.map(r => r.id);
      const buildingData = dataset.filter(d => buildingRoomIds.includes(d.roomId));
      data = aggregateByBuilding(buildingData);
      data = data.filter(d => d.buildingId === selectedBuilding);
      locationName = building.name;
    } else if (level === 'room' && selectedRoom) {
      // Filter by specific room
      data = dataset.filter(d => d.roomId === selectedRoom);
      locationName = data[0]?.roomName || 'Room';
    }
    
    // Detect anomalies
    const detectedAlerts = detectAnomalies(data);
    setAlerts(detectedAlerts);
    
    // Calculate summary
    const usageSummary = getUsageSummary(data, dataset, level);
    setSummary(usageSummary);
    
    // Generate insights
    const generatedInsights = generateInsights(data, detectedAlerts, usageSummary);
    setInsights(generatedInsights);
    
    // Generate recommendations
    const recs = generateRecommendations(locationName, detectedAlerts, usageSummary);
    setRecommendations(recs);
    
    // Calculate savings
    const potentialSavings = calculateSavings(usageSummary, detectedAlerts);
    setSavings(potentialSavings);
    
    setFilteredData(data);
  }, [energyData, level, selectedBuilding, selectedRoom]);
  
  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (newLevel === 'campus') {
      setSelectedBuilding(null);
      setSelectedRoom(null);
    } else if (newLevel === 'building') {
      setSelectedRoom(null);
    }
  };
  
  const handleBuildingChange = (buildingId) => {
    setSelectedBuilding(buildingId);
    setSelectedRoom(null);
  };
  
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
        backgroundImage:
          'radial-gradient(circle at 12% 20%, rgba(31, 122, 92, 0.12), transparent 45%), radial-gradient(circle at 85% 2%, rgba(29, 78, 216, 0.12), transparent 45%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Header activeView={activeView} onViewChange={onViewChange} notifications={headerAlerts} />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                    Campus Overview
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5 }}>
                    Good morning, Energy Ops Team
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Real-time load tracking across Green Valley University.
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Current Load
                      </Typography>
                      <Typography variant="h5">{currentLoad} kWh</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg {averageLoad} kWh
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Daily Cost
                      </Typography>
                      <Typography variant="h5">₹{dailyCost}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on current usage
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Active Alerts
                      </Typography>
                      <Typography variant="h5">{alerts.length}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Monitoring in progress
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <Button variant="contained" color="primary" sx={{ borderRadius: 999 }}>
                    View Usage
                  </Button>
                  <Button variant="outlined" color="primary" sx={{ borderRadius: 999 }}>
                    Download Report
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Usage Insights
              </Typography>
              <MetricsCards summary={summary} alerts={alerts} />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <StackedAreaChart view={view} height={380} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <ActionableInsights />
          </Grid>
          <Grid item xs={12} lg={4}>
            <BuildingBreakdown data={filteredData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
