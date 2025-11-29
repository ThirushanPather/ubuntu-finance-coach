import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import './Chat.css';

const ARK_API_URL = '/api/v1';

export default function Chat() {
  // Load conversation from localStorage on mount
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        role: 'assistant',
        content: 'Sawubona! 👋 I\'m your Ubuntu Finance Coach. I can help you:\n\n• Create a personalized budget\n• Set savings goals\n• Track your spending\n• Give financial advice\n\nWhat would you like help with today?'
      }
    ];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { addTransaction, updateBudget, addSavingsGoal } = useFinance();

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseAIResponse = (response) => {
    let parsedResponse = response;
    let actionsPerformed = [];

    // Check for budget creation
    const budgetMatch = response.match(/```-?budget\n([\s\S]*?)\n```/);
    if (budgetMatch) {
      try {
        const budgetData = JSON.parse(budgetMatch[1]);
        updateBudget(budgetData);
        parsedResponse = parsedResponse.replace(/```-?budget\n[\s\S]*?\n```/, '');
        actionsPerformed.push('✅ **Budget created!** Check the Budget tab to see your new budget.');
      } catch (e) {
        console.error('Failed to parse budget:', e);
        actionsPerformed.push('❌ Failed to create budget. Please try again.');
      }
    }

    // Check for savings goal
    const goalMatch = response.match(/```-?goal\n([\s\S]*?)\n```/);
    if (goalMatch) {
      try {
        const goalData = JSON.parse(goalMatch[1]);
        addSavingsGoal(goalData);
        parsedResponse = parsedResponse.replace(/```-?goal\n[\s\S]*?\n```/, '');
        actionsPerformed.push('✅ **Savings goal created!** Check the Savings tab to track your progress.');
      } catch (e) {
        console.error('Failed to parse goal:', e);
        actionsPerformed.push('❌ Failed to create savings goal. Please try again.');
      }
    }

    // Check for transaction
    const transactionMatch = response.match(/```-?transaction\n([\s\S]*?)\n```/);
    if (transactionMatch) {
      try {
        const transactionData = JSON.parse(transactionMatch[1]);
        addTransaction(transactionData);
        parsedResponse = parsedResponse.replace(/```-?transaction\n[\s\S]*?\n```/, '');
        actionsPerformed.push('✅ **Transaction added!** Check your Dashboard to see the update.');
      } catch (e) {
        console.error('Failed to parse transaction:', e);
        actionsPerformed.push('❌ Failed to add transaction. Please try again.');
      }
    }

    // Combine parsed response with action notifications
    if (actionsPerformed.length > 0) {
      return parsedResponse.trim() + '\n\n' + actionsPerformed.join('\n');
    }

    return parsedResponse;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Create query
      const queryName = `query-${Date.now()}`;
      
      // Build conversation history as a single input string
      const conversationContext = updatedMessages
        .slice(0, -1) // Exclude the current message
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');
      
      const fullInput = conversationContext 
        ? `Previous conversation:\n${conversationContext}\n\nCurrent user message: ${input}`
        : input;
      
      const payload = {
        name: queryName,
        input: fullInput,
        targets: [{ name: 'ubuntu-orchestrator-agent', type: 'agent' }]
      };
      
      console.log('Sending to API:', payload);
      
      const createResponse = await fetch(`${ARK_API_URL}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create query');
      }

      // Poll for response
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`${ARK_API_URL}/queries/${queryName}`);
        const data = await statusResponse.json();

        if (data.status.phase === 'done') {
          const rawResponse = data.status.responses[0].content;
          const parsedResponse = parseAIResponse(rawResponse);
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: parsedResponse
          }]);
          setIsLoading(false);
          return;
        }

        if (data.status.phase === 'failed') {
          throw new Error('Query failed');
        }

        attempts++;
      }

      throw new Error('Query timeout');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    const initialMessage = {
      role: 'assistant',
      content: 'Sawubona! 👋 I\'m your Ubuntu Finance Coach. I can help you:\n\n• Create a personalized budget\n• Set savings goals\n• Track your spending\n• Give financial advice\n\nWhat would you like help with today?'
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="clear-chat-btn" onClick={clearConversation} title="Clear conversation">
          🗑️ Clear Chat
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your finances..."
          rows="2"
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
}