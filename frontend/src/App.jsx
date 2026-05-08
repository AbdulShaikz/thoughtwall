import { useEffect, useState } from 'react'

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
      const response = await fetch('http://localhost:5000/messages');
      if(!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error);
    }
    finally{
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!newMessage.trim()) return

    try {
      const response = await fetch('http://localhost:5000/messages',{
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
    <>
      <section id="center">
        <h1>ThoughtWall</h1>

        <form onSubmit={handleSubmit}>
          <input type="text" 
            placeholder='type a message...'
            value={newMessage} 
            onChange={(e)=>setNewMessage(e.target.value)}
          />
          <button type='submit'>Post</button>
        </form>

        <div className="hero">
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                {message.text}-<em>{new Date(message.created_at).toLocaleString()}</em>
            </li>
          ))}
          </ul>
        </div>
      </section>
    </>
  )
  
}

export default App;
