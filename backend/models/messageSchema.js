const mongoose = require('mongoose');


const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', messageSchema);
