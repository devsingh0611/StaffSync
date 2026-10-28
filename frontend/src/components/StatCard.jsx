import React from 'react';

const StatCard = ({ title, value, icon, color = '#2563eb', bgLight = '#eff6ff', trend, subtext }) => {
  return (
    <div className="stat-card">
      <div>
        <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <h3 className="fw-bold mt-2 mb-1" style={{ color: '#0f172a', fontSize: '1.85rem' }}>
          {value !== undefined && value !== null ? value : 0}
        </h3>
        {trend && (
          <div className="d-flex align-items-center gap-1 mt-1">
            <span className="badge rounded-pill bg-success-subtle text-success fw-semibold" style={{ fontSize: '0.75rem' }}>
              {trend}
            </span>
            {subtext && <span className="text-muted" style={{ fontSize: '0.75rem' }}>{subtext}</span>}
          </div>
        )}
        {!trend && subtext && (
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {subtext}
          </span>
        )}
      </div>
      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: bgLight,
          color: color,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
