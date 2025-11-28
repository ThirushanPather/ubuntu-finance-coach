import React, { useState, useEffect } from 'react';
import { FinanceProvider } from './contexts/FinanceContext';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Transactions from './components/Transactions';
import Savings from './components/Savings';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem('ubuntu_user_name');
    if (savedName) {
      setUserName(savedName);
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = (name) => {
    setUserName(name);
    localStorage.setItem('ubuntu_user_name', name);
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <FinanceProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="brand">
              <div className="brand-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5"/>
                  <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="3" fill="currentColor"/>
                </svg>
              </div>
              <div className="brand-text">
                <h1 className="brand-title">Ubuntu Finance Coach</h1>
                <p className="brand-tagline">Sawubona, {userName}!</p>
              </div>
            </div>
          </div>
        </header>

        <div className="app-container">
          <nav className="sidebar">
            <button 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Dashboard
            </button>

            <button 
              className={`nav-item ${currentView === 'budget' ? 'active' : ''}`}
              onClick={() => setCurrentView('budget')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
              Budget
            </button>

            <button 
              className={`nav-item ${currentView === 'transactions' ? 'active' : ''}`}
              onClick={() => setCurrentView('transactions')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Transactions
            </button>

            <button 
              className={`nav-item ${currentView === 'savings' ? 'active' : ''}`}
              onClick={() => setCurrentView('savings')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Savings
            </button>

            <button 
              className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentView('chat')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              Coach
            </button>
          </nav>

          <main className="main-content">
            {currentView === 'dashboard' && <Dashboard userName={userName} />}
            {currentView === 'budget' && <Budget />}
            {currentView === 'transactions' && <Transactions />}
            {currentView === 'savings' && <Savings />}
            {currentView === 'chat' && <Chat />}
          </main>
        </div>
      </div>
    </FinanceProvider>
  );
}

function WelcomeScreen({ onComplete }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">
          <svg width="80" height="80" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="welcome-title">Sawubona!</h1>
        <p className="welcome-subtitle">Welcome to Ubuntu Finance Coach</p>
        <p className="welcome-text">
          "I am because we are" - Let's build your financial future together.
        </p>
        
        <form onSubmit={handleSubmit} className="welcome-form">
          <label htmlFor="name">What's your name?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
          <button type="submit" disabled={!name.trim()}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;