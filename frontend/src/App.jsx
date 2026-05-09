import { useEffect, useState } from 'react'
import './App.css'
import API_URL from './api';

function App() {
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  const [newMessage, setNewMessage] = useState('');

  useEffect(()=>{
    fetchMessages();
  },[]);

  const fetchMessages = async ()=> {
    try {
      const response = await fetch(`${API_URL}/messages`);
      if(!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    finally{
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!newMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/messages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: newMessage.trim()})
      })

      if(!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to post');
      }

      setNewMessage('');
      await fetchMessages();

    } catch (error) {
      setError(error.message);
    }
  }
  if (loading) return (<p>Loading messages...</p>);

  if(error) return (<p>Error: {error}</p>);

  return (
    <div>
      <nav>ThoughtWall</nav>

      <div className='container'>
        <form onSubmit={handleSubmit}>
          <input type="text" 
            placeholder='type a message...'
            value={newMessage} 
            onChange={(e)=>setNewMessage(e.target.value)}
          />
          <button type='submit'>Post</button>
        </form>
      </div>

      {messages.map((message) => (
        <div  key={message.id} className='card'>
          <p>
            {message.text}
          </p>
          <em>{new Date(message.created_at).toLocaleString()}</em>
        </div>
      ))}
    </div>
  )
  
}

export default App;
