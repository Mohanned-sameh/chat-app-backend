const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get Messages Route
router.get('/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Send Message Route
router.post('/', async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: 'Error sending message' });
  }
});

module.exports = router;
