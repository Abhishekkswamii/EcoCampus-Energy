import React from 'react';

const InsightPanel = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        💡 Actionable Insights & Tips
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border-l-4 pl-4 py-3 rounded-r-lg ${
              insight.priority === 'high' 
                ? 'border-red-500 bg-red-50' 
                : insight.priority === 'medium'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-green-500 bg-green-50'
            }`}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">{insight.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                  {insight.category}
                </h4>
                <p className="text-sm text-gray-700">
                  {insight.tip}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💚 Implementing these tips can reduce campus energy consumption by 15-25%
        </p>
      </div>
    </div>
  );
};

export default InsightPanel;
