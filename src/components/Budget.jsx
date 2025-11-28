import React from 'react';
import './Budget.css';

export default function Budget() {
  return (
    <div className="budget">
      <div className="budget-header">
        <h2>Budget Planner</h2>
        <button className="primary-btn">Create Budget</button>
      </div>

      <div className="budget-empty">
        <div className="empty-icon">📊</div>
        <h3>No Budget Yet</h3>
        <p>Chat with your Ubuntu Coach to create a personalized budget based on your income and expenses.</p>
        <button className="secondary-btn">Talk to Coach</button>
      </div>
    </div>
  );
}