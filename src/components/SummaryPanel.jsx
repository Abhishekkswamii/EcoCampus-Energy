import React from 'react';

const SummaryPanel = ({ summary, recommendations, savings, level, location }) => {
  if (!summary) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Decision Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-xs uppercase font-semibold opacity-90 mb-1">Total Consumption</p>
          <p className="text-2xl font-bold">{summary.total.toLocaleString()} kWh</p>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-xs uppercase font-semibold opacity-90 mb-1">Average Usage</p>
          <p className="text-2xl font-bold">{summary.average} kWh</p>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-xs uppercase font-semibold opacity-90 mb-1">Peak Hour</p>
          <p className="text-2xl font-bold">{summary.peakHour}:00</p>
          <p className="text-xs opacity-75">{summary.peakHourAvg} kWh avg</p>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-xs uppercase font-semibold opacity-90 mb-1">Peak Consumption</p>
          <p className="text-2xl font-bold">{summary.max} kWh</p>
        </div>
      </div>
      
      {savings && (
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2 flex items-center">
            <span className="mr-2">💰</span>
            Potential Savings
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs opacity-90">Energy</p>
              <p className="text-xl font-bold">{savings.energySavings} kWh</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Cost</p>
              <p className="text-xl font-bold">${savings.costSavings}</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Reduction</p>
              <p className="text-xl font-bold">{savings.percentage}%</p>
            </div>
          </div>
        </div>
      )}
      
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Key Recommendations
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-2 mt-0.5">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-white border-opacity-20 text-center">
        <p className="text-xs opacity-75">
          Viewing: {level === 'campus' ? 'Entire Campus' : level === 'building' ? `Building Level${location ? ': ' + location : ''}` : `Room Level${location ? ': ' + location : ''}`}
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;
