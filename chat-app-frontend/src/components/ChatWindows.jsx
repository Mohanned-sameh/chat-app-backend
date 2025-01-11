import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

const socket = io('http://localhost:5000');

const ChatWindow = ({ selectedChat, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const sendMessage = () => {
    const message = {
      sender: user.id,
      receiver: selectedChat.id,
      content: newMessage,
    };
    socket.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat with {selectedChat.name}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>
              {msg.sender === user.id ? 'You' : selectedChat.name}:
            </strong>{' '}
            {msg.content}
          </p>
        ))}
      </div>
      <input
        type='text'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder='Type a message...'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

ChatWindow.propTypes = {
  selectedChat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default ChatWindow;
