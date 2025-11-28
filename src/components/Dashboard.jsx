import React from 'react';
import './Dashboard.css';

export default function Dashboard({ userName }) {
  const stats = [
    { label: 'Monthly Income', value: 'R 0', icon: '💰', color: 'sage' },
    { label: 'Monthly Expenses', value: 'R 0', icon: '📊', color: 'terracotta' },
    { label: 'Savings Goal', value: '0%', icon: '🎯', color: 'sky' },
    { label: 'Days to Payday', value: '-', icon: '📅', color: 'sunset' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {userName}!</h2>
        <p>Here's your financial overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">
            <span>➕</span> Add Income
          </button>
          <button className="action-btn">
            <span>➖</span> Add Expense
          </button>
          <button className="action-btn">
            <span>🎯</span> Set Goal
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="empty-state">
          <p>No transactions yet. Start by adding your first income or expense!</p>
        </div>
      </div>
    </div>
  );
}