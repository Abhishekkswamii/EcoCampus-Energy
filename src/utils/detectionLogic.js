// Rule-based detection for abnormal energy usage

// Detect spikes: consumption > 150% of average
export const detectSpikes = (data) => {
  if (!data || data.length === 0) return [];
  
  const alerts = [];
  const avgConsumption = data.reduce((sum, d) => sum + d.consumption, 0) / data.length;
  const threshold = avgConsumption * 1.5;
  
  data.forEach(record => {
    if (record.consumption > threshold) {
      alerts.push({
        type: 'spike',
        severity: 'high',
        timestamp: record.timestamp,
        consumption: record.consumption,
        average: Math.round(avgConsumption * 10) / 10,
        location: record.roomName || record.buildingName || 'Campus',
        message: `Abnormal spike detected: ${record.consumption} kWh (${Math.round((record.consumption / avgConsumption - 1) * 100)}% above average)`
      });
    }
  });
  
  return alerts;
};

// Detect high after-hours usage (6 PM - 6 AM)
export const detectAfterHoursUsage = (data) => {
  if (!data || data.length === 0) return [];
  
  const alerts = [];
  
  // Calculate average daytime usage (8 AM - 6 PM)
  const daytimeData = data.filter(d => d.hour >= 8 && d.hour < 18);
  const nightData = data.filter(d => d.hour >= 18 || d.hour < 6);
  
  if (daytimeData.length === 0 || nightData.length === 0) return [];
  
  const avgDaytime = daytimeData.reduce((sum, d) => sum + d.consumption, 0) / daytimeData.length;
  const avgNight = nightData.reduce((sum, d) => sum + d.consumption, 0) / nightData.length;
  
  // If night usage is > 50% of daytime, flag it
  if (avgNight > avgDaytime * 0.5) {
    nightData.forEach(record => {
      if (record.consumption > avgDaytime * 0.4) {
        alerts.push({
          type: 'after-hours',
          severity: 'medium',
          timestamp: record.timestamp,
          consumption: record.consumption,
          hour: record.hour,
          location: record.roomName || record.buildingName || 'Campus',
          message: `High after-hours usage: ${record.consumption} kWh at ${record.hour}:00 (likely idle systems or unnecessary lighting)`
        });
      }
    });
  }
  
  return alerts;
};

// Detect wasteful patterns
export const detectWastefulPatterns = (data) => {
  if (!data || data.length === 0) return [];
  
  const alerts = [];
  
  // Check for consistent high night usage (possible idle equipment)
  const nightData = data.filter(d => d.hour >= 22 || d.hour < 6);
  const avgNightConsumption = nightData.reduce((sum, d) => sum + d.consumption, 0) / nightData.length;
  
  if (avgNightConsumption > 30) { // More than 30 kWh during deep night
    alerts.push({
      type: 'wasteful-pattern',
      severity: 'medium',
      location: nightData[0]?.roomName || nightData[0]?.buildingName || 'Campus',
      message: `Consistently high late-night usage (avg ${Math.round(avgNightConsumption)} kWh). Check for idle equipment, servers, or HVAC systems running unnecessarily.`
    });
  }
  
  return alerts;
};

// Main detection function
export const detectAnomalies = (data) => {
  const spikeAlerts = detectSpikes(data);
  const afterHoursAlerts = detectAfterHoursUsage(data);
  const wastefulAlerts = detectWastefulPatterns(data);
  
  // Combine and sort by severity
  const allAlerts = [...spikeAlerts, ...afterHoursAlerts, ...wastefulAlerts];
  
  // Remove duplicates and sort
  const uniqueAlerts = allAlerts.filter((alert, index, self) =>
    index === self.findIndex(a => 
      a.type === alert.type && 
      a.location === alert.location && 
      a.timestamp === alert.timestamp
    )
  );
  
  return uniqueAlerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

// Get summary statistics
export const getUsageSummary = (data, allData, level = 'campus') => {
  if (!data || data.length === 0) return null;
  
  const totalConsumption = data.reduce((sum, d) => sum + d.consumption, 0);
  const avgConsumption = totalConsumption / data.length;
  const maxConsumption = Math.max(...data.map(d => d.consumption));
  const minConsumption = Math.min(...data.map(d => d.consumption));
  
  // Find peak hour
  const hourlyAvg = {};
  data.forEach(d => {
    if (!hourlyAvg[d.hour]) {
      hourlyAvg[d.hour] = { total: 0, count: 0 };
    }
    hourlyAvg[d.hour].total += d.consumption;
    hourlyAvg[d.hour].count += 1;
  });
  
  let peakHour = 0;
  let peakHourAvg = 0;
  Object.entries(hourlyAvg).forEach(([hour, stats]) => {
    const avg = stats.total / stats.count;
    if (avg > peakHourAvg) {
      peakHourAvg = avg;
      peakHour = parseInt(hour);
    }
  });
  
  return {
    total: Math.round(totalConsumption * 10) / 10,
    average: Math.round(avgConsumption * 10) / 10,
    max: Math.round(maxConsumption * 10) / 10,
    min: Math.round(minConsumption * 10) / 10,
    peakHour: peakHour,
    peakHourAvg: Math.round(peakHourAvg * 10) / 10
  };
};
