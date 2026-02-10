import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

const StackedAreaChart = ({ view, height = 520 }) => {
  // Generate sample data for 24 hours with stacked consumption by building
  const generateChartData = () => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      let admin, cafeteria, dorms, library;

      if (hour >= 0 && hour < 6) {
        // Night time
        admin = 20 + Math.random() * 10;
        cafeteria = 15 + Math.random() * 5;
        dorms = 40 + Math.random() * 15;
        library = 10 + Math.random() * 5;
      } else if (hour >= 6 && hour < 8) {
        // Early morning
        admin = 40 + Math.random() * 15;
        cafeteria = 50 + Math.random() * 20;
        dorms = 60 + Math.random() * 20;
        library = 30 + Math.random() * 10;
      } else if (hour >= 8 && hour < 18) {
        // Working hours
        admin = 60 + Math.random() * 20;
        cafeteria = 80 + Math.random() * 30;
        dorms = 50 + Math.random() * 20;
        library = 90 + Math.random() * 30;
      } else if (hour >= 18 && hour < 22) {
        // Evening
        admin = 40 + Math.random() * 15;
        cafeteria = 60 + Math.random() * 20;
        dorms = 70 + Math.random() * 25;
        library = 50 + Math.random() * 15;
      } else {
        // Late night
        admin = 25 + Math.random() * 10;
        cafeteria = 20 + Math.random() * 10;
        dorms = 50 + Math.random() * 15;
        library = 15 + Math.random() * 5;
      }

      data.push({
        time: `${String(hour).padStart(2, '0')}:${hour % 2 === 0 ? '00' : '30'}`,
        hour: `23:${hour}:${hour < 10 ? '0' + hour : hour}`,
        Admin: Math.round(admin),
        Cafeteria: Math.round(cafeteria),
        Dorms: Math.round(dorms),
        Library: Math.round(library),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            bgcolor: '#1a1f35',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: 160,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: entry.color, fontSize: 13, mr: 2 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
                {entry.value} kWh
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              pt: 1,
              mt: 1,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13 }}>
              Total:
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {total} kWh
            </Typography>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: '#1a1f35',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
          24-Hour Energy Consumption
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorCafeteria" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorDorms" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="colorLibrary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255, 255, 255, 0.4)"
            style={{ fontSize: 12 }}
            tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.4)"
            style={{ fontSize: 12 }}
            tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
            formatter={(value) => <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13 }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="Admin"
            stackId="1"
            stroke="#f97316"
            fill="url(#colorAdmin)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Cafeteria"
            stackId="1"
            stroke="#ef4444"
            fill="url(#colorCafeteria)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Dorms"
            stackId="1"
            stroke="#10b981"
            fill="url(#colorDorms)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Library"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#colorLibrary)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StackedAreaChart;
