import React, { useState } from 'react';
import './TransactionModal.css';

export default function AddToGoalModal({ goal, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onSubmit(parseFloat(amount));
      onClose();
    }
  };

  const remaining = goal.target - goal.current;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💰 Add to {goal.name}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="goal-progress-info">
            <div className="info-row">
              <span>Current:</span>
              <strong>R {goal.current.toFixed(2)}</strong>
            </div>
            <div className="info-row">
              <span>Target:</span>
              <strong>R {goal.target.toFixed(2)}</strong>
            </div>
            <div className="info-row highlight">
              <span>Remaining:</span>
              <strong>R {remaining.toFixed(2)}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Amount to Add (R)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}