import React from 'react';

const StatBar = ({ items = [] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="stat-bar">
      {items.map((item, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon" aria-hidden>
            {item.icon || 'ℹ️'}
          </div>
          <div className="stat-content">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatBar;
