const Conversation = require('../models/conversationSchema');
const Message = require('../models/messageSchema');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');
const { getReciverSocketId, io } = require('../socket/socket');

const sendMessage = async (req, res) => {
  try {
    const reciverId = req.params.id;
    const { textMessage: message, senderId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId]
      });
    }

    const newMessage = await Message.create({
      senderId, reciverId, message
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit new message to recipient via socket.io
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit('newMessage', newMessage);
    }

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};



const getFriends = async (req, res) => {
  try {
    const { username } = req.params;
    // Find the user by username and exclude the password field
    const user = await User.findOne({ username })
      .populate({
        path: 'following',
        select: '-password' // Exclude the password field
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the list of following users
    res.json(user.following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




const getAllMessages = async (req, res) => {
  try {
    const senderId = req.query.senderId
    const reciverId = req.params.id

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    }).populate('messages')
    if (!conversation) { return res.status(201).json({ success: true, messages: [] }) }

    return res.status(201).json({ success: true, messages: conversation?.messages })

  } catch (error) {
    console.log(error.message)
  }
};

// Define other controller methods here...

module.exports = { sendMessage, getFriends, getAllMessages };
