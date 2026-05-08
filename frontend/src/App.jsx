import { useEffect, useState } from 'react'

function App() {
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=> {
    fetch('http://localhost:5000/messages')
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Fetch error');
        setError(err.message);
        setLoading(false);
      });
  },[])

  if (loading) return (<p>Loading messages...</p>);

  if(error) return (<p>Error: {error}</p>);

  return (
    <>
      <section id="center">
        <h1>ThoughtWall</h1>
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

export default App
