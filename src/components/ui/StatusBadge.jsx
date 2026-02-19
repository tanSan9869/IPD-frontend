import React from 'react';

const StatusBadge = ({ status = 'pending', children, className = '' }) => {
  const normalized = String(status).toLowerCase();
  return (
    <span className={`status-badge status-${normalized} ${className}`.trim()}>
      {children || normalized}
    </span>
  );
};

export default StatusBadge;
