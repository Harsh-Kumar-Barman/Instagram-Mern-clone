const mongoose = require('mongoose');
const plm =require('passport-local-mongoose')

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'profilePic.jpeg' },
  bio: { type: String, default: 'king is here' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts:[
    {type: mongoose.Schema.Types.ObjectId, ref:'Post'}
  ],
  savedPosts:[
    {type: mongoose.Schema.Types.ObjectId, ref:'Post'}
  ]

}, { timestamps: true });

userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema);
