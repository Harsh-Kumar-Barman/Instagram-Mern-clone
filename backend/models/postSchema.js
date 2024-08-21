const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    caption: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageWidth: Number, 
    imageHeight: Number, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String},
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
