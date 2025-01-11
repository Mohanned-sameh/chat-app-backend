const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
dotenv.config();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const User = require('./models/User');
const Message = require('./models/Message');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, content } = data;
    try {
      const message = await Message.create({ sender, receiver, content });
      io.to(receiver).emit('receiveMessage', message);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
