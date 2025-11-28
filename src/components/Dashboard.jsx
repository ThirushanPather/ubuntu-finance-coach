import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionModal from './TransactionModal';
import './Dashboard.css';

export default function Dashboard({ userName }) {
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    transactions, 
    addTransaction,
    savingsGoals,
    streak,
    badges
  } = useFinance();
  
  const [showModal, setShowModal] = useState(null);

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const savingsProgress = savingsGoals.length > 0 
    ? Math.round((savingsGoals.reduce((sum, g) => sum + g.current, 0) / savingsGoals.reduce((sum, g) => sum + g.target, 0)) * 100) || 0
    : 0;

  const stats = [
    { label: 'Monthly Income', value: `R ${totalIncome.toFixed(2)}`, icon: '💰', color: 'sage' },
    { label: 'Monthly Expenses', value: `R ${totalExpenses.toFixed(2)}`, icon: '📊', color: 'terracotta' },
    { label: 'Savings Goal', value: `${savingsProgress}%`, icon: '🎯', color: 'sky' },
    { label: 'Day Streak', value: streak.current, icon: '🔥', color: 'sunset' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {userName}!</h2>
        <p>Here's your financial overview</p>
      </div>

      {badges.length > 0 && (
        <div className="badges-section">
          <h3>🏆 Your Badges</h3>
          <div className="badges-grid">
            {badges.includes('first_transaction') && <span className="badge">First Transaction 🎯</span>}
            {badges.includes('first_budget') && <span className="badge">First Budget 📊</span>}
            {badges.includes('week_streak') && <span className="badge">7 Day Streak 🔥</span>}
            {badges.includes('saved_1000') && <span className="badge">Saved R1000 💰</span>}
            {badges.includes('goal_achieved') && <span className="badge">Goal Achieved 🎉</span>}
          </div>
        </div>
      )}

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
          <button className="action-btn" onClick={() => setShowModal('income')}>
            <span>➕</span> Add Income
          </button>
          <button className="action-btn" onClick={() => setShowModal('expense')}>
            <span>➖</span> Add Expense
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet. Start by adding your first income or expense!</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentTransactions.map(t => (
              <div key={t.id} className={`transaction-item ${t.type}`}>
                <div className="transaction-info">
                  <div className="transaction-category">{t.category}</div>
                  {t.description && <div className="transaction-desc">{t.description}</div>}
                  <div className="transaction-date">
                    {new Date(t.date).toLocaleDateString('en-ZA')}
                  </div>
                </div>
                <div className={`transaction-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}R {t.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          type={showModal}
          onClose={() => setShowModal(null)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}