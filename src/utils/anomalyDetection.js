// Advanced anomaly detection for Usage page
// Rule-based system to detect wasteful energy patterns

const COST_PER_KWH = 8; // ₹8 per kWh

/**
 * Detect after-hours anomalies
 * Rule: If after-hours average > working hours average by 20%, flag as abnormal
 */
export const detectAfterHoursAnomaly = (data) => {
  if (!data || data.length === 0) {
    return { hasAnomaly: false, details: null };
  }

  // Separate working hours (8 AM - 6 PM) vs after-hours (6 PM - 8 AM)
  const workingHours = data.filter(d => d.hour >= 8 && d.hour < 18);
  const afterHours = data.filter(d => d.hour >= 18 || d.hour < 8);

  if (workingHours.length === 0 || afterHours.length === 0) {
    return { hasAnomaly: false, details: null };
  }

  const avgWorking = workingHours.reduce((sum, d) => sum + d.consumption, 0) / workingHours.length;
  const avgAfter = afterHours.reduce((sum, d) => sum + d.consumption, 0) / afterHours.length;

  const percentageHigher = ((avgAfter / avgWorking) - 1) * 100;

  // Anomaly threshold: after-hours > 20% of working hours
  if (percentageHigher > 20) {
    const totalWaste = afterHours.reduce((sum, d) => {
      const expectedUsage = avgWorking * 0.2; // Expected: 20% of working hours
      const excess = Math.max(0, d.consumption - expectedUsage);
      return sum + excess;
    }, 0);

    const estimatedCost = totalWaste * COST_PER_KWH;

    return {
      hasAnomaly: true,
      details: {
        type: 'after-hours',
        severity: percentageHigher > 50 ? 'high' : 'medium',
        avgWorking: Math.round(avgWorking * 10) / 10,
        avgAfter: Math.round(avgAfter * 10) / 10,
        percentageHigher: Math.round(percentageHigher),
        totalWaste: Math.round(totalWaste * 10) / 10,
        estimatedCost: Math.round(estimatedCost),
        message: `After-hours usage is ${Math.round(percentageHigher)}% higher than working hours`,
        recommendation: 'Consider implementing automated shutdown procedures after 6 PM'
      }
    };
  }

  return { hasAnomaly: false, details: null };
};

/**
 * Detect weekend anomalies
 * Rule: If weekend usage > 30% of weekday usage, flag as wasteful
 */
export const detectWeekendAnomaly = (data) => {
  if (!data || data.length === 0) {
    return { hasAnomaly: false, details: null };
  }

  const weekdayData = [];
  const weekendData = [];

  data.forEach(record => {
    const date = new Date(record.timestamp);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendData.push(record);
    } else {
      weekdayData.push(record);
    }
  });

  if (weekdayData.length === 0 || weekendData.length === 0) {
    return { hasAnomaly: false, details: null };
  }

  const avgWeekday = weekdayData.reduce((sum, d) => sum + d.consumption, 0) / weekdayData.length;
  const avgWeekend = weekendData.reduce((sum, d) => sum + d.consumption, 0) / weekendData.length;

  const percentageOfWeekday = (avgWeekend / avgWeekday) * 100;

  if (percentageOfWeekday > 30) {
    const totalWeekendConsumption = weekendData.reduce((sum, d) => sum + d.consumption, 0);
    const expectedWeekendUsage = avgWeekday * 0.2 * weekendData.length;
    const waste = Math.max(0, totalWeekendConsumption - expectedWeekendUsage);
    const estimatedCost = waste * COST_PER_KWH;

    return {
      hasAnomaly: true,
      details: {
        type: 'weekend',
        severity: percentageOfWeekday > 50 ? 'high' : 'medium',
        avgWeekday: Math.round(avgWeekday * 10) / 10,
        avgWeekend: Math.round(avgWeekend * 10) / 10,
        percentageOfWeekday: Math.round(percentageOfWeekday),
        totalWaste: Math.round(waste * 10) / 10,
        estimatedCost: Math.round(estimatedCost),
        message: `Weekend usage is ${Math.round(percentageOfWeekday)}% of weekday usage`,
        recommendation: 'Review weekend operations and consider power-saving modes'
      }
    };
  }

  return { hasAnomaly: false, details: null };
};

/**
 * Detect consumption spikes
 * Rule: If any hour's consumption > 200% of average, flag as spike
 */
export const detectConsumptionSpikes = (data) => {
  if (!data || data.length === 0) {
    return { hasSpikes: false, spikes: [] };
  }

  const avgConsumption = data.reduce((sum, d) => sum + d.consumption, 0) / data.length;
  const threshold = avgConsumption * 2.0; // 200% threshold

  const spikes = data
    .filter(record => record.consumption > threshold)
    .map(record => ({
      timestamp: record.timestamp,
      consumption: Math.round(record.consumption * 10) / 10,
      average: Math.round(avgConsumption * 10) / 10,
      percentageAbove: Math.round(((record.consumption / avgConsumption) - 1) * 100),
      estimatedExcess: Math.round((record.consumption - avgConsumption) * COST_PER_KWH)
    }));

  return {
    hasSpikes: spikes.length > 0,
    spikes: spikes.slice(0, 5) // Return top 5 spikes
  };
};

/**
 * Detect baseline creep
 * Rule: If baseline consumption is increasing over time, flag as inefficiency
 */
export const detectBaselineCreep = (data) => {
  if (!data || data.length < 14) {
    return { hasCreep: false, details: null };
  }

  // Sort by timestamp
  const sorted = [...data].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Split into first half and second half
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint);
  const secondHalf = sorted.slice(midpoint);

  const avgFirst = firstHalf.reduce((sum, d) => sum + d.consumption, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, d) => sum + d.consumption, 0) / secondHalf.length;

  const percentageIncrease = ((avgSecond / avgFirst) - 1) * 100;

  if (percentageIncrease > 10) {
    const extraConsumption = (avgSecond - avgFirst) * secondHalf.length;
    const estimatedCost = extraConsumption * COST_PER_KWH;

    return {
      hasCreep: true,
      details: {
        type: 'baseline-creep',
        severity: percentageIncrease > 20 ? 'high' : 'medium',
        avgFirst: Math.round(avgFirst * 10) / 10,
        avgSecond: Math.round(avgSecond * 10) / 10,
        percentageIncrease: Math.round(percentageIncrease),
        extraConsumption: Math.round(extraConsumption * 10) / 10,
        estimatedCost: Math.round(estimatedCost),
        message: `Baseline consumption increased by ${Math.round(percentageIncrease)}% over time`,
        recommendation: 'Audit equipment for degradation or unauthorized additions'
      }
    };
  }

  return { hasCreep: false, details: null };
};

/**
 * Master anomaly detector - runs all detection rules
 */
export const detectAllAnomalies = (data) => {
  const afterHours = detectAfterHoursAnomaly(data);
  const weekend = detectWeekendAnomaly(data);
  const spikes = detectConsumptionSpikes(data);
  const baseline = detectBaselineCreep(data);

  const anomalies = [];
  
  if (afterHours.hasAnomaly) {
    anomalies.push(afterHours.details);
  }
  
  if (weekend.hasAnomaly) {
    anomalies.push(weekend.details);
  }
  
  if (baseline.hasCreep) {
    anomalies.push(baseline.details);
  }

  // Calculate total estimated waste
  const totalWaste = anomalies.reduce((sum, a) => sum + (a.totalWaste || a.extraConsumption || 0), 0);
  const totalCost = anomalies.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  return {
    hasAnomalies: anomalies.length > 0,
    anomalies,
    spikes,
    summary: {
      totalWaste: Math.round(totalWaste * 10) / 10,
      totalCost: Math.round(totalCost),
      anomalyCount: anomalies.length,
      spikeCount: spikes.spikes.length
    }
  };
};

/**
 * Determine waste status for overview card
 */
export const getWasteStatus = (data) => {
  const result = detectAllAnomalies(data);
  
  if (!result.hasAnomalies && !result.spikes.hasSpikes) {
    return {
      status: 'Normal',
      color: 'success',
      message: 'No significant anomalies detected'
    };
  }
  
  const highSeverityCount = result.anomalies.filter(a => a.severity === 'high').length;
  
  if (highSeverityCount > 0) {
    return {
      status: 'Critical',
      color: 'error',
      message: `${highSeverityCount} critical waste pattern${highSeverityCount > 1 ? 's' : ''} detected`
    };
  }
  
  return {
    status: 'Warning',
    color: 'warning',
    message: `${result.anomalyCount} anomal${result.anomalyCount > 1 ? 'ies' : 'y'} detected`
  };
};
