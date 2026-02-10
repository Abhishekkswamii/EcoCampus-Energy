import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

const EnergyChart = ({ data, view, chartType = 'line', onChartTypeChange }) => {
  if (!data || data.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
          <Typography variant="h6">No data available</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try selecting a building or room to view data.
          </Typography>
        </Box>
      </Paper>
    );
  }
  
  // Prepare chart data based on view
  const prepareChartData = () => {
    if (view === 'hourly') {
      // Group by hour and show last 24 hours
      return data.slice(-24).map(d => ({
        name: `${d.hour}:00`,
        consumption: d.consumption,
        time: new Date(d.timestamp).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit' 
        })
      }));
    } else if (view === 'daily') {
      // Show last 7 days
      const dailyMap = {};
      data.forEach(d => {
        if (!dailyMap[d.day]) {
          dailyMap[d.day] = { day: d.day, consumption: 0 };
        }
        dailyMap[d.day].consumption += d.consumption;
      });
      
      return Object.values(dailyMap).slice(-7).map(d => ({
        name: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        consumption: Math.round(d.consumption * 10) / 10
      }));
    } else if (view === 'weekly') {
      // Group by week
      const weeklyMap = {};
      data.forEach(d => {
        const date = new Date(d.day || d.timestamp);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyMap[weekKey]) {
          weeklyMap[weekKey] = { week: weekKey, consumption: 0 };
        }
        weeklyMap[weekKey].consumption += d.consumption;
      });
      
      return Object.values(weeklyMap).map(d => ({
        name: `Week of ${new Date(d.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        consumption: Math.round(d.consumption * 10) / 10
      }));
    } else if (view === 'monthly') {
      // Group by month
      const monthlyMap = {};
      data.forEach(d => {
        const date = new Date(d.day || d.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { month: monthKey, consumption: 0 };
        }
        monthlyMap[monthKey].consumption += d.consumption;
      });
      
      return Object.values(monthlyMap).map(d => ({
        name: new Date(d.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        consumption: Math.round(d.consumption * 10) / 10
      }));
    }
  };
  
  const chartData = prepareChartData();
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 1.25,
            border: (t) => `1px solid ${t.palette.divider}`,
            minWidth: 180,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {payload[0].payload.time || payload[0].payload.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.25, color: 'primary.main' }}>
            {payload[0].value} kWh
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Energy Consumption</Typography>
          <Typography variant="body2" color="text.secondary">
            {view.charAt(0).toUpperCase() + view.slice(1)} view • {chartData.length} points
          </Typography>
        </Box>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={chartType}
          onChange={(_, next) => next && onChartTypeChange?.(next)}
        >
          <ToggleButton value="line" sx={{ gap: 0.75 }}>
            <ShowChartRoundedIcon fontSize="small" />
            Line
          </ToggleButton>
          <ToggleButton value="bar" sx={{ gap: 0.75 }}>
            <BarChartRoundedIcon fontSize="small" />
            Bar
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#0B8F5A" 
              strokeWidth={2}
              dot={{ fill: '#0B8F5A', r: 3 }}
              activeDot={{ r: 6 }}
              name="Consumption (kWh)"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="consumption" 
              fill="#0B8F5A" 
              name="Consumption (kWh)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
};

export default EnergyChart;
