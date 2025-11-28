import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Check connection on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => setConnected(res.ok))
      .catch(() => setConnected(false));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const messageText = input;
    setInput('');
    setLoading(true);

    try {
      // Create query
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
      
      // Poll for result
      let agentText = 'No response';
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`/api/v1/queries/${queryName}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status?.phase === 'done') {
          // Extract response from responses array
          if (statusData.status.responses?.[0]?.content) {
            agentText = statusData.status.responses[0].content;
          }
          break;
        }
        
        if (statusData.status?.phase === 'failed') {
          agentText = 'Query failed';
          break;
        }
      }
      
      setMessages(prev => [...prev, { sender: 'agent', text: agentText }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: `Error: ${error.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Ubuntu Finance Coach - ARK Connection Test</h1>
      
      <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? '✓ Connected to ARK API' : '✗ ARK API Not Connected'}
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && <div className="message agent">Agent is typing...</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;