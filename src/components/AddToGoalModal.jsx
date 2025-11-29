import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import './TransactionModal.css';

export default function AddToGoalModal({ goal, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { getCurrentBalance } = useFinance();

  const currentBalance = getCurrentBalance();

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum > currentBalance) {
      setError(`Insufficient balance. You only have R${currentBalance.toFixed(2)} available.`);
      return;
    }

    onSubmit(amountNum);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to {goal.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="balance-info">
          <div className="balance-label">Your Current Balance:</div>
          <div className={`balance-value ${currentBalance < 0 ? 'negative' : ''}`}>
            R {currentBalance.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount to Add</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="Enter amount"
              required
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="goal-progress-preview">
            <div className="preview-label">After adding this amount:</div>
            <div className="preview-stats">
              <div className="preview-item">
                <span>Goal Progress:</span>
                <span className="preview-value">
                  R{((goal.current || 0) + parseFloat(amount || 0)).toFixed(2)} / R{goal.target.toFixed(2)}
                </span>
              </div>
              <div className="preview-item">
                <span>Remaining Balance:</span>
                <span className={`preview-value ${(currentBalance - parseFloat(amount || 0)) < 0 ? 'negative' : ''}`}>
                  R{(currentBalance - parseFloat(amount || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-btn"
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
            >
              Add to Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}