import Message from "../models/Message.js";

export const handleIncomingMessage = (io) => (socket) => {
  console.log('a user connected');

  // Listen for incoming messages
  socket.on('message', async (data) => {
    console.log('message received:', data);

    try {
      // Save the message to the database
      const message = new Message({
        text: data.text,
        sender: data.sender,
        receiver: data.recipient,
      });

      await message.save();

      // Broadcast the message to all connected clients
      io.emit('message', data);
    } catch (error) {
      console.error('Error saving message to the database:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
};

export const getUserMessages = async (req, res) => {
  try {
    const userId = req.params.id;
    const friendId = req.params.friendId
    console.log('id', userId, 'fr ', friendId);
    // Retrieve messages for the user
   
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    });

    console.log('Msg ',messages);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const DeleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    
    // Check if the message exists
    const existingMessage = await Message.findById(messageId);
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Delete the message
    await existingMessage.remove();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

