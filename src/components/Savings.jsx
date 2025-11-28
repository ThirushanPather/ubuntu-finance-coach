import React from 'react';
import './Savings.css';

export default function Savings() {
  return (
    <div className="savings">
      <div className="savings-header">
        <h2>Savings Goals</h2>
        <button className="primary-btn">+ New Goal</button>
      </div>

      <div className="savings-empty">
        <div className="empty-icon">🎯</div>
        <h3>No Savings Goals Yet</h3>
        <p>Set your first savings goal and watch your progress grow!</p>
        <button className="secondary-btn">Create Your First Goal</button>
      </div>
    </div>
  );
}