import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-xl p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;