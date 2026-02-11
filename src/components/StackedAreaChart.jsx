import React, { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, Stack, FormControl, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';

const StackedAreaChart = ({ view, height = 520 }) => {
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [chartType, setChartType] = useState('area');
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    if (selectedDay !== 'today') {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedDay]);

  const seededRandom = (seed) => {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
  };

  const getBaseLoads = (hour) => {
    if (hour >= 0 && hour < 6) {
      return { admin: 20, cafeteria: 15, dorms: 40, library: 10, variance: 10 };
    }
    if (hour >= 6 && hour < 8) {
      return { admin: 40, cafeteria: 50, dorms: 60, library: 30, variance: 16 };
    }
    if (hour >= 8 && hour < 18) {
      return { admin: 60, cafeteria: 80, dorms: 50, library: 90, variance: 22 };
    }
    if (hour >= 18 && hour < 22) {
      return { admin: 40, cafeteria: 60, dorms: 70, library: 50, variance: 18 };
    }
    return { admin: 25, cafeteria: 20, dorms: 50, library: 15, variance: 12 };
  };

  const dayProfiles = {
    today: { admin: 1, cafeteria: 1, dorms: 1, library: 1, variability: 1 },
    yesterday: { admin: 0.95, cafeteria: 1.05, dorms: 0.98, library: 0.92, variability: 0.9 },
    last7: { admin: 0.9, cafeteria: 0.95, dorms: 0.93, library: 0.9, variability: 0.75 },
  };

  const daySeeds = { today: 11, yesterday: 23, last7: 37 };

  const chartData = useMemo(() => {
    const profile = dayProfiles[selectedDay] || dayProfiles.today;
    const daySeed = daySeeds[selectedDay] || daySeeds.today;

    const normalizeLocation = (values) => {
      if (selectedLocation === 'all') {
        return values;
      }

      return {
        Admin: selectedLocation === 'admin' ? values.Admin : 0,
        Cafeteria: selectedLocation === 'cafeteria' ? values.Cafeteria : 0,
        Dorms: selectedLocation === 'dorms' ? values.Dorms : 0,
        Library: selectedLocation === 'library' ? values.Library : 0,
      };
    };

    if (selectedDay === 'last7') {
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return weekDays.map((day, index) => {
        const baseSeed = daySeed * 100 + index * 31;
        const dayFactor = 0.9 + seededRandom(baseSeed) * 0.25;
        const values = normalizeLocation({
          Admin: Math.round(70 * profile.admin * dayFactor + seededRandom(baseSeed + 1) * 10),
          Cafeteria: Math.round(95 * profile.cafeteria * dayFactor + seededRandom(baseSeed + 2) * 12),
          Dorms: Math.round(85 * profile.dorms * dayFactor + seededRandom(baseSeed + 3) * 12),
          Library: Math.round(75 * profile.library * dayFactor + seededRandom(baseSeed + 4) * 11),
        });

        return {
          time: day,
          ...values,
        };
      });
    }

    const data = [];
    const maxHour = selectedDay === 'today' ? currentTime.getHours() : 23;
    for (let hour = 0; hour <= maxHour; hour++) {
      const base = getBaseLoads(hour);
      const jitter = (offset) => (seededRandom(daySeed * 100 + hour * 7 + offset) - 0.5) * base.variance * profile.variability;

      let admin = base.admin * profile.admin + jitter(1);
      let cafeteria = base.cafeteria * profile.cafeteria + jitter(2);
      let dorms = base.dorms * profile.dorms + jitter(3);
      let library = base.library * profile.library + jitter(4);

      admin = Math.max(5, admin);
      cafeteria = Math.max(5, cafeteria);
      dorms = Math.max(5, dorms);
      library = Math.max(5, library);

      const values = normalizeLocation({
        Admin: Math.round(admin),
        Cafeteria: Math.round(cafeteria),
        Dorms: Math.round(dorms),
        Library: Math.round(library),
      });

      data.push({
        time: `${String(hour).padStart(2, '0')}:${hour % 2 === 0 ? '00' : '30'}`,
        hour: `23:${hour}:${hour < 10 ? '0' + hour : hour}`,
        ...values,
      });
    }
    return data;
  }, [currentTime, selectedDay, selectedLocation]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            bgcolor: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.4)',
            minWidth: 160,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: entry.color, fontSize: 13, mr: 2 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 600 }}>
                {entry.value} kWh
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              pt: 1,
              mt: 1,
              borderTop: '1px solid rgba(148, 163, 184, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
              Total:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontWeight: 700 }}>
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
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
          24-Hour Energy Consumption
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            exclusive
            size="small"
            value={chartType}
            onChange={(_, next) => next && setChartType(next)}
            sx={{ bgcolor: '#fff', borderRadius: 999 }}
          >
            <ToggleButton value="area" sx={{ textTransform: 'none', px: 2 }}>
              Area
            </ToggleButton>
            <ToggleButton value="bar" sx={{ textTransform: 'none', px: 2 }}>
              Bar
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, fontSize: 11 }}>
              Day
            </Typography>
            <Select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              sx={{ bgcolor: '#fff' }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7">Last 7 Days</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, fontSize: 11 }}>
              Location
            </Typography>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              sx={{ bgcolor: '#fff' }}
            >
              <MenuItem value="all">All Buildings</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="cafeteria">Cafeteria</MenuItem>
              <MenuItem value="dorms">Dorms</MenuItem>
              <MenuItem value="library">Library</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              dataKey="time"
              stroke="rgba(71, 85, 105, 0.8)"
              style={{ fontSize: 12 }}
              tick={{ fill: 'rgba(71, 85, 105, 0.8)' }}
            />
            <YAxis
              stroke="rgba(71, 85, 105, 0.8)"
              style={{ fontSize: 12 }}
              tick={{ fill: 'rgba(71, 85, 105, 0.8)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              formatter={(value) => <span style={{ color: 'rgba(71, 85, 105, 0.9)', fontSize: 13 }}>{value}</span>}
            />
            <Bar dataKey="Admin" stackId="1" fill="#f97316" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Cafeteria" stackId="1" fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Dorms" stackId="1" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Library" stackId="1" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              dataKey="time"
              stroke="rgba(71, 85, 105, 0.8)"
              style={{ fontSize: 12 }}
              tick={{ fill: 'rgba(71, 85, 105, 0.8)' }}
            />
            <YAxis
              stroke="rgba(71, 85, 105, 0.8)"
              style={{ fontSize: 12 }}
              tick={{ fill: 'rgba(71, 85, 105, 0.8)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              formatter={(value) => <span style={{ color: 'rgba(71, 85, 105, 0.9)', fontSize: 13 }}>{value}</span>}
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
        )}
      </ResponsiveContainer>
    </Paper>
  );
};

export default StackedAreaChart;
