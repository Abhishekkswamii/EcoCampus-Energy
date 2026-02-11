// Generate actionable insights and recommendations for Usage page

/**
 * Generate insights based on anomaly detection results
 */
export const generateInsightsFromAnomalies = (anomalyResult, summaryStats) => {
  const insights = [];

  if (!anomalyResult.hasAnomalies && !anomalyResult.spikes.hasSpikes) {
    insights.push({
      title: 'Optimal Energy Usage',
      finding: 'Your energy consumption patterns are within normal ranges.',
      impact: 'No significant waste or inefficiencies detected.',
      action: 'Continue monitoring and maintain current practices.',
      icon: '✅',
      severity: 'success'
    });
    return insights;
  }

  // After-hours anomaly insights
  const afterHours = anomalyResult.anomalies.find(a => a.type === 'after-hours');
  if (afterHours) {
    insights.push({
      title: 'High After-Hours Consumption',
      finding: `After-hours usage is ${afterHours.percentageHigher}% higher than working hours (${afterHours.avgAfter} kWh vs ${afterHours.avgWorking} kWh).`,
      impact: `Estimated waste: ${afterHours.totalWaste} kWh = ₹${afterHours.estimatedCost} in energy loss.`,
      action: afterHours.recommendation,
      icon: '🌙',
      severity: afterHours.severity
    });
  }

  // Weekend anomaly insights
  const weekend = anomalyResult.anomalies.find(a => a.type === 'weekend');
  if (weekend) {
    insights.push({
      title: 'Excessive Weekend Usage',
      finding: `Weekend consumption is ${weekend.percentageOfWeekday}% of weekday levels, suggesting unnecessary equipment running.`,
      impact: `Estimated waste: ${weekend.totalWaste} kWh = ₹${weekend.estimatedCost}.`,
      action: weekend.recommendation,
      icon: '📅',
      severity: weekend.severity
    });
  }

  // Baseline creep insights
  const baseline = anomalyResult.anomalies.find(a => a.type === 'baseline-creep');
  if (baseline) {
    insights.push({
      title: 'Rising Baseline Consumption',
      finding: `Energy consumption has increased by ${baseline.percentageIncrease}% over the period (from ${baseline.avgFirst} to ${baseline.avgSecond} kWh).`,
      impact: `Extra consumption: ${baseline.extraConsumption} kWh = ₹${baseline.estimatedCost}.`,
      action: baseline.recommendation,
      icon: '📈',
      severity: baseline.severity
    });
  }

  // Spike insights
  if (anomalyResult.spikes.hasSpikes) {
    const topSpike = anomalyResult.spikes.spikes[0];
    insights.push({
      title: 'Consumption Spikes Detected',
      finding: `${anomalyResult.spikes.spikes.length} spike(s) found. Peak spike: ${topSpike.consumption} kWh (${topSpike.percentageAbove}% above average).`,
      impact: `Spikes indicate faulty equipment, unauthorized high-power devices, or HVAC issues.`,
      action: 'Investigate equipment logs during spike times. Check for malfunctioning AC units or unauthorized heaters.',
      icon: '⚡',
      severity: 'high'
    });
  }

  return insights;
};

/**
 * Generate general recommendations based on building/room type
 */
export const generateLocationRecommendations = (buildingId, roomId, campusStructure) => {
  const recommendations = [];

  // Find the room/building names
  let locationName = 'Campus';
  let locationType = 'general';

  if (buildingId && buildingId !== 'all') {
    const building = campusStructure.buildings.find(b => b.id === buildingId);
    if (building) {
      locationName = building.name;
      locationType = building.id;
    }
  }

  if (roomId && roomId !== 'all') {
    const room = campusStructure.buildings
      .flatMap(b => b.rooms)
      .find(r => r.id === roomId);
    if (room) {
      locationName = room.name;
      if (room.name.includes('Lab')) locationType = 'lab';
      else if (room.name.includes('Hostel')) locationType = 'hostel';
      else if (room.name.includes('Lecture')) locationType = 'lecture';
      else if (room.name.includes('Library') || room.name.includes('Reading')) locationType = 'library';
      else if (room.name.includes('Office') || room.name.includes('Admin')) locationType = 'office';
    }
  }

  // Location-specific recommendations
  switch (locationType) {
    case 'lab':
      recommendations.push({
        title: 'Computer Lab Best Practices',
        tips: [
          'Enable hibernate mode after 15 minutes of inactivity',
          'Use thin clients instead of full PCs where possible (60% energy savings)',
          'Install smart power strips to eliminate phantom loads',
          'Schedule automatic shutdowns at 9 PM on weekdays, 6 PM on weekends'
        ],
        icon: '💻'
      });
      break;

    case 'hostel':
      recommendations.push({
        title: 'Hostel Energy Management',
        tips: [
          'Implement floor-wise power monitoring and display dashboards',
          'Run monthly energy-saving competitions with incentives',
          'Restrict high-power appliances (heaters, kettles) with smart meters',
          'Install solar water heaters to reduce electric geysers load'
        ],
        icon: '🏠'
      });
      break;

    case 'lecture':
      recommendations.push({
        title: 'Lecture Hall Optimization',
        tips: [
          'Install occupancy sensors for automatic lighting control',
          'Use natural ventilation when outdoor temperature is 20-25°C',
          'Pre-cool halls 30 minutes before class, then raise AC temp by 2°C',
          'Ensure projectors and audio systems auto-off after 15 minutes'
        ],
        icon: '🎓'
      });
      break;

    case 'library':
      recommendations.push({
        title: 'Library Energy Efficiency',
        tips: [
          'Use LED task lighting instead of full overhead lighting',
          'Zone HVAC by occupancy (reading rooms vs storage areas)',
          'Implement daylight harvesting with automated dimming',
          'Set computer sleep timers to 10 minutes'
        ],
        icon: '📚'
      });
      break;

    case 'office':
      recommendations.push({
        title: 'Office Area Efficiency',
        tips: [
          'Encourage "last one out" protocols to check all equipment is off',
          'Replace desktop computers with laptops (70% less energy)',
          'Set printer/copier sleep timers to 5 minutes',
          'Use smart thermostats with presence detection'
        ],
        icon: '🏢'
      });
      break;

    default:
      recommendations.push({
        title: 'Campus-Wide Recommendations',
        tips: [
          'Upgrade to LED lighting campus-wide (saves 75% on lighting costs)',
          'Install solar panels on building rooftops (aim for 30% renewable energy)',
          'Conduct quarterly energy audits to identify new inefficiencies',
          'Launch campus-wide awareness campaigns and track improvements'
        ],
        icon: '🌍'
      });
  }

  return recommendations;
};

/**
 * Calculate potential savings
 */
export const calculatePotentialSavings = (anomalyResult) => {
  const totalWaste = anomalyResult.summary.totalWaste;
  const totalCost = anomalyResult.summary.totalCost;

  // Estimate monthly and yearly savings if anomalies are fixed
  const dailyWaste = totalWaste / 7; // Assuming data is for a week
  const monthlySavings = Math.round(dailyWaste * 30 * 8); // ₹8 per kWh
  const yearlySavings = Math.round(monthlySavings * 12);

  return {
    weeklyWaste: Math.round(totalWaste * 10) / 10,
    weeklyCost: totalCost,
    monthlySavings,
    yearlySavings,
    message: `By addressing these issues, you could save approximately ₹${monthlySavings.toLocaleString()}/month or ₹${yearlySavings.toLocaleString()}/year.`
  };
};

// Legacy function (keep for compatibility with existing components)
export const generateInsights = (data, alerts, summary) => {
  const insights = [];
  
  insights.push({
    category: 'General',
    icon: '💡',
    tip: 'Schedule automated shutdowns for non-essential equipment after 8 PM to reduce standby power consumption.'
  });
  
  // Insights based on alerts
  if (alerts && alerts.length > 0) {
    const spikeAlerts = alerts.filter(a => a.type === 'spike');
    const afterHoursAlerts = alerts.filter(a => a.type === 'after-hours');
    
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
  }
  
  return insights.slice(0, 5);
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
  const usdToInr = 82.5;
  const ratePerKwhInr = 0.15 * usdToInr; // Assuming $0.15 per kWh
  const costSavings = Math.round(totalSavings * ratePerKwhInr * 10) / 10;
  
  return {
    energySavings: totalSavings,
    costSavings: costSavings,
    percentage: Math.round((totalSavings / summary.total) * 100)
  };
};
