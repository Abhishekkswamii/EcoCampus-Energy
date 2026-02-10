import { campusStructure } from './campusStructure';

// Generate realistic hourly energy consumption data
// Returns data for the last 30 days with hourly granularity

const generateHourlyPattern = (baseLoad, isWeekend = false, hasSpike = false, spikeHour = null) => {
  const hourlyData = [];
  
  for (let hour = 0; hour < 24; hour++) {
    let consumption = baseLoad;
    
    // Typical usage patterns
    if (hour >= 0 && hour < 6) {
      // Night time - low usage (10-20% of base)
      consumption *= isWeekend ? 0.10 : 0.15;
    } else if (hour >= 6 && hour < 8) {
      // Early morning - ramping up (30-50%)
      consumption *= isWeekend ? 0.25 : 0.45;
    } else if (hour >= 8 && hour < 18) {
      // Working hours - peak usage (80-100%)
      consumption *= isWeekend ? 0.40 : (0.85 + Math.random() * 0.15);
    } else if (hour >= 18 && hour < 22) {
      // Evening - declining (40-60%)
      consumption *= isWeekend ? 0.35 : 0.50;
    } else {
      // Late night - low (15-25%)
      consumption *= 0.20;
    }
    
    // Add random variation (±10%)
    consumption *= (0.9 + Math.random() * 0.2);
    
    // Inject spike for detection testing
    if (hasSpike && hour === spikeHour) {
      consumption *= (2.0 + Math.random() * 0.5); // 200-250% spike
    }
    
    hourlyData.push(Math.round(consumption * 10) / 10);
  }
  
  return hourlyData;
};

const generateRoomData = (roomId, roomName, daysBack = 30) => {
  const data = [];
  const now = new Date();
  
  // Base load varies by room type
  let baseLoad = 50; // kWh
  if (roomName.includes('Lab')) baseLoad = 120;
  if (roomName.includes('Hostel') || roomName.includes('Floor')) baseLoad = 180;
  if (roomName.includes('Lecture')) baseLoad = 80;
  if (roomName.includes('Reading')) baseLoad = 60;
  if (roomName.includes('Common')) baseLoad = 100;
  
  for (let day = daysBack; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Randomly inject anomalies
    const hasSpike = Math.random() < 0.05; // 5% chance of spike
    const spikeHour = hasSpike ? Math.floor(Math.random() * 24) : null;
    
    // Generate hourly data for this day
    const hourlyConsumption = generateHourlyPattern(baseLoad, isWeekend, hasSpike, spikeHour);
    
    hourlyConsumption.forEach((consumption, hour) => {
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      data.push({
        timestamp: timestamp.toISOString(),
        consumption: consumption,
        roomId: roomId,
        roomName: roomName,
        hour: hour,
        day: date.toISOString().split('T')[0]
      });
    });
  }
  
  return data;
};

const generateBuildingData = (building, daysBack = 30) => {
  const buildingData = [];
  
  building.rooms.forEach(room => {
    const roomData = generateRoomData(room.id, room.name, daysBack);
    buildingData.push(...roomData);
  });
  
  return buildingData;
};

// Generate complete campus data
export const generateCampusEnergyData = (daysBack = 30) => {
  const allData = [];
  
  campusStructure.buildings.forEach(building => {
    const buildingData = generateBuildingData(building, daysBack);
    allData.push(...buildingData);
  });
  
  return allData;
};

// Aggregate data by building
export const aggregateByBuilding = (data) => {
  const buildingMap = {};
  
  data.forEach(record => {
    const building = campusStructure.buildings.find(b => 
      b.rooms.some(r => r.id === record.roomId)
    );
    
    if (building) {
      const key = `${building.id}_${record.timestamp}`;
      if (!buildingMap[key]) {
        buildingMap[key] = {
          timestamp: record.timestamp,
          consumption: 0,
          buildingId: building.id,
          buildingName: building.name,
          hour: record.hour,
          day: record.day
        };
      }
      buildingMap[key].consumption += record.consumption;
    }
  });
  
  return Object.values(buildingMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

// Aggregate data by campus (total)
export const aggregateByCampus = (data) => {
  const campusMap = {};
  
  data.forEach(record => {
    const key = record.timestamp;
    if (!campusMap[key]) {
      campusMap[key] = {
        timestamp: record.timestamp,
        consumption: 0,
        hour: record.hour,
        day: record.day
      };
    }
    campusMap[key].consumption += record.consumption;
  });
  
  return Object.values(campusMap).map(item => ({
    ...item,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

// Filter data by date range
export const filterByDateRange = (data, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= start && recordDate <= end;
  });
};

// Aggregate hourly data to daily
export const aggregateToDaily = (data) => {
  const dailyMap = {};
  
  data.forEach(record => {
    const day = record.day;
    if (!dailyMap[day]) {
      dailyMap[day] = {
        day: day,
        consumption: 0,
        count: 0
      };
    }
    dailyMap[day].consumption += record.consumption;
    dailyMap[day].count += 1;
  });
  
  return Object.values(dailyMap).map(item => ({
    day: item.day,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

// Aggregate daily data to weekly
export const aggregateToWeekly = (dailyData) => {
  const weeklyMap = {};
  
  dailyData.forEach(record => {
    const date = new Date(record.day);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = {
        week: weekKey,
        consumption: 0
      };
    }
    weeklyMap[weekKey].consumption += record.consumption;
  });
  
  return Object.values(weeklyMap).map(item => ({
    week: item.week,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

// Aggregate daily data to monthly
export const aggregateToMonthly = (dailyData) => {
  const monthlyMap = {};
  
  dailyData.forEach(record => {
    const date = new Date(record.day);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        month: monthKey,
        consumption: 0
      };
    }
    monthlyMap[monthKey].consumption += record.consumption;
  });
  
  return Object.values(monthlyMap).map(item => ({
    month: item.month,
    consumption: Math.round(item.consumption * 10) / 10
  }));
};

// Generate the main dataset (singleton)
export const ENERGY_DATA = generateCampusEnergyData(30);
