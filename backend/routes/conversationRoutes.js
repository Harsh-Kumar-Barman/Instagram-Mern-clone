const express = require('express');
const { sendMessage, getFriends, getAllMessages } = require('../controllers/conversationController');
const router = express.Router();

router.post('/send/message/:id', sendMessage);
router.get('/followingUsers/:username', getFriends);
router.get('/all/messages/:id', getAllMessages);

module.exports = router;
