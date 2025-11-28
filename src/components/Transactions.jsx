import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionModal from './TransactionModal';
import './Transactions.css';

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const [showModal, setShowModal] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
  };

  return (
    <div className="transactions">
      <div className="transactions-header">
        <h2>Transactions</h2>
        <div className="header-actions">
          <button className="add-btn income" onClick={() => setShowModal('income')}>
            + Add Income
          </button>
          <button className="add-btn expense" onClick={() => setShowModal('expense')}>
            + Add Expense
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'income' ? 'active' : ''} 
          onClick={() => setFilter('income')}
        >
          Income
        </button>
        <button 
          className={filter === 'expense' ? 'active' : ''} 
          onClick={() => setFilter('expense')}
        >
          Expenses
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="transactions-empty">
          <div className="empty-icon">📝</div>
          <h3>No Transactions Yet</h3>
          <p>Start tracking your income and expenses to build better financial habits.</p>
        </div>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map(t => (
            <div key={t.id} className={`transaction-card ${t.type}`}>
              <div className="transaction-main">
                <div className="transaction-icon">
                  {t.type === 'income' ? '💰' : '📊'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-category">{t.category}</div>
                  {t.description && (
                    <div className="transaction-description">{t.description}</div>
                  )}
                  <div className="transaction-date">
                    {new Date(t.date).toLocaleDateString('en-ZA', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="transaction-right">
                <div className={`transaction-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}R {t.amount.toFixed(2)}
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm('Delete this transaction?')) {
                      deleteTransaction(t.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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