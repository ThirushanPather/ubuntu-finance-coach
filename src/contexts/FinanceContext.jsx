import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('financeUser');
    return saved ? JSON.parse(saved) : { name: '', monthlyIncome: 0 };
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('financeTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('financeBudget');
    return saved ? JSON.parse(saved) : { categories: [] };
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('financeSavingsGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('financeBadges');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('financeStreak');
    return saved ? JSON.parse(saved) : { current: 0, lastActive: null };
  });

  useEffect(() => {
    localStorage.setItem('financeUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financeBudget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('financeSavingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('financeBadges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('financeStreak', JSON.stringify(streak));
  }, [streak]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...transaction
    };
    setTransactions(prev => [newTransaction, ...prev]);
    updateStreak();
    checkBadges();
    return newTransaction;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateBudget = (newBudget) => {
    setBudget(newBudget);
    checkBadges();
  };

  const addBudgetCategory = (category) => {
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { id: Date.now().toString(), ...category }]
    }));
  };

  const updateBudgetCategory = (id, updates) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteBudgetCategory = (id) => {
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  const addSavingsGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      current: 0,
      createdAt: new Date().toISOString(),
      ...goal
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    checkBadges();
    return newGoal;
  };

  const updateSavingsGoal = (id, updates) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    checkBadges();
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const addToSavingsGoal = (id, amount) => {
    setSavingsGoals(prev => prev.map(g => 
      g.id === id ? { ...g, current: g.current + amount } : g
    ));
    checkBadges();
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = streak.lastActive ? new Date(streak.lastActive).toDateString() : null;
    
    if (lastActive === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastActive === yesterdayStr) {
      setStreak({ current: streak.current + 1, lastActive: new Date().toISOString() });
    } else {
      setStreak({ current: 1, lastActive: new Date().toISOString() });
    }
  };

  const checkBadges = () => {
    const newBadges = [];
    
    if (budget.categories.length > 0 && !badges.includes('first_budget')) {
      newBadges.push('first_budget');
    }
    
    if (transactions.length >= 1 && !badges.includes('first_transaction')) {
      newBadges.push('first_transaction');
    }
    
    if (streak.current >= 7 && !badges.includes('week_streak')) {
      newBadges.push('week_streak');
    }
    
    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.current, 0);
    if (totalSaved >= 1000 && !badges.includes('saved_1000')) {
      newBadges.push('saved_1000');
    }
    
    const achievedGoal = savingsGoals.some(g => g.current >= g.target);
    if (achievedGoal && !badges.includes('goal_achieved')) {
      newBadges.push('goal_achieved');
    }
    
    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
    }
  };

  const getTotalIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategorySpending = (categoryName) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               t.category === categoryName && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const value = {
    user,
    updateUser,
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    budget,
    updateBudget,
    addBudgetCategory,
    updateBudgetCategory,
    deleteBudgetCategory,
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavingsGoal,
    badges,
    streak,
    getTotalIncome,
    getTotalExpenses,
    getCategorySpending
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};