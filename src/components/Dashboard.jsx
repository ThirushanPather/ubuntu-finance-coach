import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionModal from './TransactionModal';
import './Dashboard.css';

export default function Dashboard() {
  const { 
    transactions, 
    getCurrentBalance, 
    getTotalExpenses, 
    savingsGoals,
    badges, 
    streak,
    addTransaction,
    clearAllData
  } = useFinance();
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('income');

  const currentBalance = getCurrentBalance();
  const monthlyExpenses = getTotalExpenses();
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.current, 0);

  const handleAddTransaction = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmitTransaction = (transaction) => {
    addTransaction(transaction);
    setShowModal(false);
  };

  const badgeIcons = {
    first_transaction: '🎯',
    first_budget: '📊',
    week_streak: '🔥',
    saved_1000: '💰',
    goal_achieved: '🎉'
  };

  const badgeNames = {
    first_transaction: 'First Transaction',
    first_budget: 'Budget Created',
    week_streak: '7 Day Streak',
    saved_1000: 'Saved R1000',
    goal_achieved: 'Goal Achieved'
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h2>Sawubona! 👋</h2>
          <p>Welcome to your Ubuntu Finance Coach</p>
        </div>
        <button 
          className="reset-btn" 
          onClick={() => {
            if (window.confirm('⚠️ This will delete ALL your data (budget, transactions, goals, chat history). Are you sure?')) {
              clearAllData();
            }
          }}
          title="Reset all data for fresh demo"
        >
          🔄 Reset Demo
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-label">Current Balance</div>
            <div className={`stat-value ${currentBalance < 0 ? 'negative' : ''}`}>
              R {currentBalance.toFixed(2)}
            </div>
            <div className="stat-hint">Available after expenses & savings</div>
          </div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-label">Monthly Expenses</div>
            <div className="stat-value">R {monthlyExpenses.toFixed(2)}</div>
            <div className="stat-hint">Total spent this month</div>
          </div>
        </div>

        <div className="stat-card savings">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Total Savings</div>
            <div className="stat-value">R {totalSavings.toFixed(2)}</div>
            <div className="stat-hint">Money set aside for goals</div>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Day Streak</div>
            <div className="stat-value">{streak.current}</div>
            <div className="stat-hint">Keep the momentum going!</div>
          </div>
        </div>
      </div>

      <div className="badges-section">
        <h3>Your Badges</h3>
        <div className="badges-grid">
          {badges.length === 0 ? (
            <p className="no-badges">Start your financial journey to earn badges! 🌟</p>
          ) : (
            badges.map(badge => (
              <div key={badge} className="badge">
                <span className="badge-icon">{badgeIcons[badge]}</span>
                <span className="badge-name">{badgeNames[badge]}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <div className="quick-actions">
            <button 
              className="quick-btn income"
              onClick={() => handleAddTransaction('income')}
            >
              + Add Income
            </button>
            <button 
              className="quick-btn expense"
              onClick={() => handleAddTransaction('expense')}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No transactions yet. Add your first one!</p>
          </div>
        ) : (
          <div className="activity-list">
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className={`activity-item ${transaction.type}`}>
                <div className="activity-icon">
                  {transaction.type === 'income' ? '📈' : '📉'}
                </div>
                <div className="activity-details">
                  <div className="activity-description">{transaction.description}</div>
                  <div className="activity-category">{transaction.category}</div>
                </div>
                <div className={`activity-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}R {transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          type={modalType}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
}
