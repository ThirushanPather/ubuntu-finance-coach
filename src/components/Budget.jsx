import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import BudgetModal from './BudgetModal';
import './Budget.css';

export default function Budget() {
  const { budget, updateBudget, getCategorySpending } = useFinance();
  const [showModal, setShowModal] = useState(false);

  const handleSaveBudget = (budgetData) => {
    updateBudget(budgetData);
  };

  const hasBudget = budget.categories && budget.categories.length > 0;

  return (
    <div className="budget">
      <div className="budget-header">
        <h2>Budget Planner</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          {hasBudget ? 'Edit Budget' : 'Create Budget'}
        </button>
      </div>

      {!hasBudget ? (
        <div className="budget-empty">
          <div className="empty-icon">📊</div>
          <h3>No Budget Yet</h3>
          <p>Create a personalized budget to track your spending and reach your financial goals.</p>
          <button className="secondary-btn" onClick={() => setShowModal(true)}>
            Create Budget
          </button>
        </div>
      ) : (
        <div className="budget-content">
          <div className="budget-overview">
            <div className="overview-card">
              <div className="overview-label">Monthly Income</div>
              <div className="overview-value">R {budget.income?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="overview-card">
              <div className="overview-label">Total Budget</div>
              <div className="overview-value">R {budget.totalBudget?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="overview-card">
              <div className="overview-label">Remaining</div>
              <div className="overview-value positive">
                R {((budget.income || 0) - (budget.totalBudget || 0)).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="categories-list">
            <h3>Budget Categories</h3>
            {budget.categories.map(category => {
              const spent = getCategorySpending(category.name);
              const percentage = (spent / category.amount) * 100;
              const isOverBudget = spent > category.amount;

              return (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <div className="category-name">{category.name}</div>
                    <div className="category-amounts">
                      <span className={isOverBudget ? 'over-budget' : ''}>
                        R {spent.toFixed(2)}
                      </span>
                      <span className="budget-limit">/ R {category.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${isOverBudget ? 'over' : ''}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="category-footer">
                    <span className={`percentage ${isOverBudget ? 'over-budget' : ''}`}>
                      {percentage.toFixed(0)}%
                    </span>
                    <span className={`remaining ${isOverBudget ? 'over-budget' : ''}`}>
                      {isOverBudget ? 'Over by' : 'Remaining'}: R {Math.abs(category.amount - spent).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <BudgetModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveBudget}
          existingBudget={hasBudget ? budget : null}
        />
      )}
    </div>
  );
}