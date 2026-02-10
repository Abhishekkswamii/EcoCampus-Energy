// Generate actionable insights and tips based on usage patterns

export const generateInsights = (data, alerts, summary) => {
  const insights = [];
  
  // Always provide general tips
  insights.push({
    category: 'General',
    icon: '💡',
    tip: 'Schedule automated shutdowns for non-essential equipment after 8 PM to reduce standby power consumption.'
  });
  
  // Insights based on alerts
  if (alerts.length > 0) {
    const spikeAlerts = alerts.filter(a => a.type === 'spike');
    const afterHoursAlerts = alerts.filter(a => a.type === 'after-hours');
    const wastefulAlerts = alerts.filter(a => a.type === 'wasteful-pattern');
    
    if (spikeAlerts.length > 0) {
      insights.push({
        category: 'Spike Detection',
        icon: '⚠️',
        tip: `${spikeAlerts.length} spike(s) detected. Investigate faulty equipment or unauthorized high-power device usage.`,
        priority: 'high'
      });
    }
    
    if (afterHoursAlerts.length > 0) {
      insights.push({
        category: 'After Hours',
        icon: '🌙',
        tip: 'High evening usage detected. Implement motion sensors for lighting and set HVAC timers to auto-off at 7 PM.',
        priority: 'medium'
      });
    }
    
    if (wastefulAlerts.length > 0) {
      insights.push({
        category: 'Waste Reduction',
        icon: '♻️',
        tip: 'Persistent night-time usage suggests idle servers or equipment. Conduct an energy audit to identify and optimize.',
        priority: 'medium'
      });
    }
  }
  
  // Insights based on peak hour
  if (summary && summary.peakHour) {
    if (summary.peakHour >= 14 && summary.peakHour <= 16) {
      insights.push({
        category: 'Peak Load',
        icon: '📊',
        tip: 'Peak usage during 2-4 PM (likely AC load). Consider pre-cooling buildings at 12 PM and raising thermostat by 2°C at 2 PM.',
      });
    }
  }
  
  // Time-of-use insights
  insights.push({
    category: 'Cost Savings',
    icon: '💰',
    tip: 'Shift high-energy tasks (laundry, water heating) to off-peak hours (10 PM - 6 AM) if your utility offers time-based rates.',
  });
  
  // Room-specific insights
  if (data && data.length > 0) {
    const roomName = data[0].roomName;
    
    if (roomName && roomName.includes('Lab')) {
      insights.push({
        category: 'Lab Efficiency',
        icon: '🔬',
        tip: 'Computer labs: Enable power-saving modes and enforce automatic logoff after 15 minutes of inactivity.',
      });
    }
    
    if (roomName && roomName.includes('Hostel')) {
      insights.push({
        category: 'Hostel Management',
        icon: '🏠',
        tip: 'Hostel blocks: Install smart meters per floor, promote energy-saving contests, and restrict high-power appliances.',
      });
    }
    
    if (roomName && roomName.includes('Lecture')) {
      insights.push({
        category: 'Lecture Halls',
        icon: '🎓',
        tip: 'Lecture halls: Use occupancy sensors to auto-dim lights and adjust HVAC when unoccupied.',
      });
    }
  }
  
  return insights.slice(0, 5); // Return top 5 insights
};

// Generate specific recommendations based on location
export const generateRecommendations = (location, alerts, summary) => {
  const recommendations = [];
  
  // High-level recommendations
  if (summary) {
    if (summary.average > 100) {
      recommendations.push('Install LED lighting campus-wide (30-40% energy savings)');
    }
    
    if (summary.peakHour >= 12 && summary.peakHour <= 16) {
      recommendations.push('Implement smart HVAC controls with occupancy detection');
    }
  }
  
  // Alert-based recommendations
  if (alerts.length > 3) {
    recommendations.push('Conduct immediate energy audit to identify inefficient equipment');
  }
  
  if (alerts.some(a => a.type === 'after-hours')) {
    recommendations.push('Deploy smart plugs to cut standby power after hours');
  }
  
  if (alerts.some(a => a.type === 'spike')) {
    recommendations.push('Install sub-meters to pinpoint exact sources of energy spikes');
  }
  
  // Location-specific
  if (location?.includes('Hostel')) {
    recommendations.push('Launch student energy awareness campaign with incentives');
  }
  
  if (location?.includes('Library')) {
    recommendations.push('Natural lighting optimization with automated blind controls');
  }
  
  // Always add a behavioral recommendation
  recommendations.push('Create an energy dashboard accessible to facility managers for real-time monitoring');
  
  return recommendations.slice(0, 3); // Return top 3 recommendations
};

// Calculate potential savings
export const calculateSavings = (summary, alerts) => {
  if (!summary) return null;
  
  let potentialSavings = 0;
  
  // Estimate savings from addressing issues
  alerts.forEach(alert => {
    if (alert.type === 'after-hours') {
      potentialSavings += alert.consumption * 0.6; // 60% of after-hours usage is wasteful
    }
    if (alert.type === 'spike') {
      potentialSavings += (alert.consumption - alert.average) * 0.8; // 80% of spike is avoidable
    }
  });
  
  // General efficiency improvements (10-15% of total consumption)
  const generalSavings = summary.total * 0.12;
  
  const totalSavings = Math.round((potentialSavings + generalSavings) * 10) / 10;
  const costSavings = Math.round(totalSavings * 0.15 * 10) / 10; // Assuming $0.15 per kWh
  
  return {
    energySavings: totalSavings,
    costSavings: costSavings,
    percentage: Math.round((totalSavings / summary.total) * 100)
  };
};
