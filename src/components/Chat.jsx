import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Sawubona! 👋 I\'m here to help you with your financial journey. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => setConnected(res.ok))
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, id: Date.now(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const messageText = input;
    setInput('');
    setLoading(true);

    try {
      const createResponse = await fetch('/api/v1/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `query-${Date.now()}`,
          input: messageText,
          targets: [{ name: 'ubuntu-orchestrator-agent', type: 'agent' }]
        })
      });

      const queryData = await createResponse.json();
      const queryName = queryData.name;
      
      let agentText = 'No response received';
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`/api/v1/queries/${queryName}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status?.phase === 'done') {
          if (statusData.status.responses?.[0]?.content) {
            agentText = statusData.status.responses[0].content;
          }
          break;
        }
        
        if (statusData.status?.phase === 'failed') {
          agentText = 'Sorry, I encountered an error. Please try again.';
          break;
        }
      }
      
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: agentText,
        id: Date.now() + 1,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: 'Connection error. Please ensure ARK API is running.',
        id: Date.now() + 1,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Your Finance Coach</h2>
        <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {connected ? 'Connected' : 'Offline'}
        </div>
      </div>

      <div className="messages-area">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender}`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message agent">
            <div className="message-bubble">
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

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about budgeting, saving, or financial advice..."
          rows="1"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}