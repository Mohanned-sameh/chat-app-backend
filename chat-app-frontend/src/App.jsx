import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Register';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindows';
import axios from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (token && !user) {
    fetchUser();
  }

  return (
    <Router>
      <div>
        {!token ? (
          <Routes>
            <Route path='/login' element={<Login setToken={setToken} />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        ) : (
          <div>
            {!selectedChat ? (
              <ChatList
                chats={[] /* Replace with chats from backend */}
                onSelectChat={setSelectedChat}
              />
            ) : (
              <ChatWindow user={user} selectedChat={selectedChat} />
            )}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
