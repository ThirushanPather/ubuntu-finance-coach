import React from 'react';
import './Transactions.css';

export default function Transactions() {
  return (
    <div className="transactions">
      <div className="transactions-header">
        <h2>Transactions</h2>
        <div className="header-actions">
          <button className="add-btn income">+ Add Income</button>
          <button className="add-btn expense">+ Add Expense</button>
        </div>
      </div>

      <div className="transactions-empty">
        <div className="empty-icon">📝</div>
        <h3>No Transactions Yet</h3>
        <p>Start tracking your income and expenses to build better financial habits.</p>
      </div>
    </div>
  );
}