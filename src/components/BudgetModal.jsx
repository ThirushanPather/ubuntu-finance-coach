import React, { useState } from 'react';
import './BudgetModal.css';

export default function BudgetModal({ onClose, onSubmit, existingBudget }) {
  const [income, setIncome] = useState(existingBudget?.income || '');
  const [categories, setCategories] = useState(existingBudget?.categories || [
    { name: 'Rent', amount: '' },
    { name: 'Food', amount: '' },
    { name: 'Transport', amount: '' },
    { name: 'Utilities', amount: '' },
  ]);

  const addCategory = () => {
    setCategories([...categories, { name: '', amount: '' }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validCategories = categories.filter(c => c.name && c.amount);
    const totalBudget = validCategories.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    
    onSubmit({
      income: parseFloat(income),
      categories: validCategories.map(c => ({
        ...c,
        amount: parseFloat(c.amount)
      })),
      totalBudget
    });
    onClose();
  };

  const totalAllocated = categories.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
  const remaining = parseFloat(income || 0) - totalAllocated;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content budget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Create Budget</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Monthly Income (R)</label>
            <input
              type="number"
              step="0.01"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <div className="budget-summary">
            <div className="summary-item">
              <span>Total Income:</span>
              <strong>R {parseFloat(income || 0).toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Allocated:</span>
              <strong>R {totalAllocated.toFixed(2)}</strong>
            </div>
            <div className={`summary-item ${remaining < 0 ? 'negative' : 'positive'}`}>
              <span>Remaining:</span>
              <strong>R {remaining.toFixed(2)}</strong>
            </div>
          </div>

          <div className="categories-section">
            <h4>Budget Categories</h4>
            {categories.map((cat, index) => (
              <div key={index} className="category-input-group">
                <input
                  type="text"
                  placeholder="Category name"
                  value={cat.name}
                  onChange={(e) => updateCategory(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={cat.amount}
                  onChange={(e) => updateCategory(index, 'amount', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="remove-category-btn"
                  onClick={() => removeCategory(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
            <button type="button" className="add-category-btn" onClick={addCategory}>
              + Add Category
            </button>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={remaining < 0}>
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}