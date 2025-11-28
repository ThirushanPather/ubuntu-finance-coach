import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import SavingsModal from './SavingsModal';
import AddToGoalModal from './AddToGoalModal';
import './Savings.css';

export default function Savings() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addToSavingsGoal } = useFinance();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(null);
  const [editGoal, setEditGoal] = useState(null);

  const handleCreateGoal = (goalData) => {
    addSavingsGoal(goalData);
  };

  const handleUpdateGoal = (goalData) => {
    updateSavingsGoal(editGoal.id, goalData);
    setEditGoal(null);
  };

  const handleAddFunds = (amount) => {
    addToSavingsGoal(showAddModal.id, amount);
    setShowAddModal(null);
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteSavingsGoal(id);
    }
  };

  return (
    <div className="savings">
      <div className="savings-header">
        <h2>Savings Goals</h2>
        <button className="primary-btn" onClick={() => setShowCreateModal(true)}>
          + New Goal
        </button>
      </div>

      {savingsGoals.length === 0 ? (
        <div className="savings-empty">
          <div className="empty-icon">🎯</div>
          <h3>No Savings Goals Yet</h3>
          <p>Set your first savings goal and watch your progress grow!</p>
          <button className="secondary-btn" onClick={() => setShowCreateModal(true)}>
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {savingsGoals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            const daysLeft = goal.deadline 
              ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div key={goal.id} className={`goal-card ${isComplete ? 'complete' : ''}`}>
                <div className="goal-header">
                  <div className="goal-category">{goal.category}</div>
                  <div className="goal-actions">
                    <button 
                      className="icon-btn"
                      onClick={() => setEditGoal(goal)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="icon-btn"
                      onClick={() => handleDeleteGoal(goal.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="goal-name">{goal.name}</h3>

                <div className="goal-progress">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="progress-percentage">
                    {percentage.toFixed(0)}%
                  </div>
                </div>

                <div className="goal-amounts">
                  <div className="amount-current">
                    R {goal.current.toFixed(2)}
                  </div>
                  <div className="amount-target">
                    of R {goal.target.toFixed(2)}
                  </div>
                </div>

                {daysLeft !== null && (
                  <div className={`goal-deadline ${daysLeft < 30 ? 'urgent' : ''}`}>
                    {daysLeft > 0 
                      ? `${daysLeft} days left`
                      : daysLeft === 0 
                        ? 'Due today!'
                        : 'Overdue'
                    }
                  </div>
                )}

                {isComplete ? (
                  <div className="goal-complete-badge">
                    🎉 Goal Achieved!
                  </div>
                ) : (
                  <button 
                    className="add-funds-btn"
                    onClick={() => setShowAddModal(goal)}
                  >
                    💰 Add Funds
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <SavingsModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGoal}
        />
      )}

      {editGoal && (
        <SavingsModal
          goal={editGoal}
          onClose={() => setEditGoal(null)}
          onSubmit={handleUpdateGoal}
        />
      )}

      {showAddModal && (
        <AddToGoalModal
          goal={showAddModal}
          onClose={() => setShowAddModal(null)}
          onSubmit={handleAddFunds}
        />
      )}
    </div>
  );
}