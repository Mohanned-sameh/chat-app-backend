import PropTypes from 'prop-types';

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => onSelectChat(chat)}>
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;
