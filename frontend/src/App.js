import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleSend() {
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: query})
    });

    const data = await res.json();
    setAnswer(data.response.join('\n'));
  }

  return (
    <div>
      <h1>JECRC GPT</h1>
      <input 
      placeholder="Ask something..." 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      <p>{answer}</p>
    </div>
  );
}

export default App;