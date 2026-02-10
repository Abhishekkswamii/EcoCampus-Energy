import React from 'react';

const AlertCard = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">✅</span>
          <div>
            <h4 className="font-semibold text-green-800">All Clear!</h4>
            <p className="text-sm text-green-600">No abnormal usage detected in the current view</p>
          </div>
        </div>
      </div>
    );
  }
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          ⚡ Detected Issues
        </h3>
        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
          {alerts.length} alert{alerts.length > 1 ? 's' : ''}
        </span>
      </div>
      
      {alerts.slice(0, 5).map((alert, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start">
            <span className="text-2xl mr-3">{getSeverityIcon(alert.severity)}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">
                  {alert.type === 'spike' && 'Energy Spike Detected'}
                  {alert.type === 'after-hours' && 'After-Hours Usage'}
                  {alert.type === 'wasteful-pattern' && 'Wasteful Pattern'}
                </h4>
                <span className="text-xs font-medium uppercase">
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm mb-2">
                {alert.message}
              </p>
              <div className="flex items-center text-xs opacity-75">
                <span className="mr-3">📍 {alert.location}</span>
                {alert.timestamp && (
                  <span>
                    🕒 {new Date(alert.timestamp).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {alerts.length > 5 && (
        <p className="text-sm text-gray-600 text-center py-2">
          + {alerts.length - 5} more alert{alerts.length - 5 > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default AlertCard;
