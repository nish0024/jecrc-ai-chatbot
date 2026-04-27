import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await res.json();
    const botMessage = { sender: 'bot', text: data.response.join('\n') };
    setMessages(prev => [...prev, botMessage]);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>🤖 JECRC GPT</h2>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', height: '400px', overflowY: 'auto', marginBottom: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              background: msg.sender === 'user' ? '#667eea' : '#f0f0f0',
              color: msg.sender === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'inline-block',
              maxWidth: '80%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          placeholder="Ask about JECRC..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;