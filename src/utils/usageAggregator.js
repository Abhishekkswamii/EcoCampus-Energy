// Utility for aggregating energy usage data by different time ranges
import { campusStructure } from '../data/campusStructure';

/**
 * Aggregate data by HOURLY (last 24 hours)
 */
export const aggregateHourly = (data) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return data
    .filter(record => new Date(record.timestamp) >= last24h)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

/**
 * Aggregate data by DAILY (last 7 days)
 */
export const aggregateDaily = (data) => {
  const dailyMap = {};
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  data
    .filter(record => new Date(record.timestamp) >= last7Days)
    .forEach(record => {
      const day = record.day;
      if (!dailyMap[day]) {
        dailyMap[day] = {
          timestamp: day,
          consumption: 0,
          roomId: record.roomId
        };
      }
      dailyMap[day].consumption += record.consumption;
    });
  
  return Object.values(dailyMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

/**
 * Aggregate data by WEEKLY (last 4 weeks)
 */
export const aggregateWeekly = (data) => {
  const weeklyMap = {};
  const now = new Date();
  const last4Weeks = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  
  data
    .filter(record => new Date(record.timestamp) >= last4Weeks)
    .forEach(record => {
      const date = new Date(record.day);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          timestamp: weekKey,
          consumption: 0,
          roomId: record.roomId
        };
      }
      weeklyMap[weekKey].consumption += record.consumption;
    });
  
  return Object.values(weeklyMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

/**
 * Aggregate data by MONTHLY (last 12 months)
 */
export const aggregateMonthly = (data) => {
  const monthlyMap = {};
  
  data.forEach(record => {
    const date = new Date(record.day);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        timestamp: monthKey,
        consumption: 0,
        roomId: record.roomId
      };
    }
    monthlyMap[monthKey].consumption += record.consumption;
  });
  
  return Object.values(monthlyMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  })).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

/**
 * Aggregate data by YEARLY
 */
export const aggregateYearly = (data) => {
  const yearlyMap = {};
  
  data.forEach(record => {
    const year = new Date(record.day).getFullYear().toString();
    
    if (!yearlyMap[year]) {
      yearlyMap[year] = {
        timestamp: year,
        consumption: 0,
        roomId: record.roomId
      };
    }
    yearlyMap[year].consumption += record.consumption;
  });
  
  return Object.values(yearlyMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  })).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
};

/**
 * Main aggregator function - selects the right aggregation based on time range
 */
export const aggregateByTimeRange = (data, timeRange) => {
  switch (timeRange) {
    case 'hourly':
      return aggregateHourly(data);
    case 'daily':
      return aggregateDaily(data);
    case 'weekly':
      return aggregateWeekly(data);
    case 'monthly':
      return aggregateMonthly(data);
    case 'yearly':
      return aggregateYearly(data);
    default:
      return aggregateDaily(data);
  }
};

/**
 * Filter data by building
 */
export const filterByBuilding = (data, buildingId) => {
  if (!buildingId || buildingId === 'all') return data;
  
  const building = campusStructure.buildings.find(b => b.id === buildingId);
  if (!building) return data;
  
  const roomIds = building.rooms.map(r => r.id);
  return data.filter(record => roomIds.includes(record.roomId));
};

/**
 * Filter data by room
 */
export const filterByRoom = (data, roomId) => {
  if (!roomId || roomId === 'all') return data;
  return data.filter(record => record.roomId === roomId);
};

/**
 * Aggregate filtered data for chart display
 */
export const prepareChartData = (data, timeRange) => {
  const aggregated = aggregateByTimeRange(data, timeRange);
  const chartMap = {};
  
  aggregated.forEach(record => {
    const key = record.timestamp;
    if (!chartMap[key]) {
      chartMap[key] = {
        timestamp: key,
        consumption: 0
      };
    }
    chartMap[key].consumption += record.consumption;
  });
  
  return Object.values(chartMap).map(item => ({
    timestamp: item.timestamp,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

/**
 * Get summary statistics
 */
export const getSummaryStats = (data, timeRange) => {
  const aggregated = aggregateByTimeRange(data, timeRange);
  
  const totalEnergy = aggregated.reduce((sum, record) => sum + record.consumption, 0);
  const avgEnergy = aggregated.length > 0 ? totalEnergy / aggregated.length : 0;
  
  // Find peak usage
  const peakRecord = aggregated.reduce((max, record) => 
    record.consumption > (max?.consumption || 0) ? record : max
  , null);
  
  return {
    totalEnergy: Math.round(totalEnergy * 10) / 10,
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    peakUsage: peakRecord ? Math.round(peakRecord.consumption * 10) / 10 : 0,
    peakTime: peakRecord ? peakRecord.timestamp : null,
    recordCount: aggregated.length
  };
};

/**
 * Compare buildings - get total consumption per building
 */
export const compareBuildings = (data, timeRange) => {
  const aggregated = aggregateByTimeRange(data, timeRange);
  const buildingMap = {};
  
  campusStructure.buildings.forEach(building => {
    buildingMap[building.id] = {
      buildingId: building.id,
      buildingName: building.name,
      consumption: 0
    };
  });
  
  aggregated.forEach(record => {
    const building = campusStructure.buildings.find(b => 
      b.rooms.some(r => r.id === record.roomId)
    );
    
    if (building && buildingMap[building.id]) {
      buildingMap[building.id].consumption += record.consumption;
    }
  });
  
  return Object.values(buildingMap)
    .map(item => ({
      ...item,
      consumption: Math.round(item.consumption * 10) / 10
    }))
    .sort((a, b) => b.consumption - a.consumption);
};

/**
 * Compare rooms within a building
 */
export const compareRooms = (data, buildingId, timeRange) => {
  const filteredData = filterByBuilding(data, buildingId);
  const aggregated = aggregateByTimeRange(filteredData, timeRange);
  const roomMap = {};
  
  const building = campusStructure.buildings.find(b => b.id === buildingId);
  if (!building) return [];
  
  building.rooms.forEach(room => {
    roomMap[room.id] = {
      roomId: room.id,
      roomName: room.name,
      consumption: 0
    };
  });
  
  aggregated.forEach(record => {
    if (roomMap[record.roomId]) {
      roomMap[record.roomId].consumption += record.consumption;
    }
  });
  
  return Object.values(roomMap)
    .map(item => ({
      ...item,
      consumption: Math.round(item.consumption * 10) / 10
    }))
    .sort((a, b) => b.consumption - a.consumption);
};
