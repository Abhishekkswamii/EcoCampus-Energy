import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MetricsCards from './MetricsCards';
import StackedAreaChart from './StackedAreaChart';
import ActionableInsights from './ActionableInsights';
import BuildingBreakdown from './BuildingBreakdown';
import ViewSelector from './ViewSelector';
import LocationSelector from './LocationSelector';
import { Box, Container, Grid, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material';
import { ENERGY_DATA, aggregateByBuilding, aggregateByCampus } from '../data/energyData';
import { getBuildingById } from '../data/campusStructure';
import { detectAnomalies, getUsageSummary } from '../utils/detectionLogic';
import { generateInsights, generateRecommendations, calculateSavings } from '../utils/insightsEngine';

const Dashboard = () => {
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
    let data = [];
    let locationName = '';
    
    if (level === 'campus') {
      // Aggregate all data by timestamp
      data = aggregateByCampus(ENERGY_DATA);
      locationName = 'Entire Campus';
    } else if (level === 'building' && selectedBuilding) {
      // Filter by building
      const building = getBuildingById(selectedBuilding);
      const buildingRoomIds = building.rooms.map(r => r.id);
      const buildingData = ENERGY_DATA.filter(d => buildingRoomIds.includes(d.roomId));
      data = aggregateByBuilding(buildingData);
      data = data.filter(d => d.buildingId === selectedBuilding);
      locationName = building.name;
    } else if (level === 'room' && selectedRoom) {
      // Filter by specific room
      data = ENERGY_DATA.filter(d => d.roomId === selectedRoom);
      locationName = data[0]?.roomName || 'Room';
    }
    
    // Detect anomalies
    const detectedAlerts = detectAnomalies(data);
    setAlerts(detectedAlerts);
    
    // Calculate summary
    const usageSummary = getUsageSummary(data, ENERGY_DATA, level);
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
  }, [level, selectedBuilding, selectedRoom]);
  
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
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0e1a' }}>
      {/* Sidebar */}
      <Sidebar activeView="dashboard" />

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: '240px' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            bgcolor: '#141928',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontSize: 28, mb: 0.5 }}>
                Energy Monitor
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
                Real-time campus energy monitoring
              </Typography>
            </Box>

            {/* Time Range & Building Selectors */}
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, fontSize: 11 }}>
                  Building
                </Typography>
                <Select
                  value="all"
                  sx={{
                    color: '#fff',
                    bgcolor: '#1a1f35',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.6)' },
                  }}
                >
                  <MenuItem value="all">All Buildings</MenuItem>
                  <MenuItem value="library">Library</MenuItem>
                  <MenuItem value="dorms">Dorms</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, fontSize: 11 }}>
                  Time Range
                </Typography>
                <Select
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  sx={{
                    color: '#fff',
                    bgcolor: '#1a1f35',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.6)' },
                  }}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>

        {/* Content */}
        <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
          {/* Metrics Cards */}
          <Box sx={{ px: 4, mb: 3 }}>
            <MetricsCards summary={summary} alerts={alerts} />
          </Box>

          {/* Full-width Chart */}
          <Box sx={{ mb: 3 }}>
            <StackedAreaChart view={view} height={380} />
          </Box>

          {/* Insights & Breakdown */}
          <Box sx={{ px: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <ActionableInsights />
              </Grid>
              <Grid item xs={12} lg={4}>
                <BuildingBreakdown data={filteredData} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
