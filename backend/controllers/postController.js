const sizeOf = require('image-size');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');


const createPost = async (req, res) => {
  try {
    const { caption, author } = req.body;
    const filePath = req.file.path;
    let mediaType = '';
    let width, height;

    if (req.file.mimetype.startsWith('image')) {
      mediaType = 'image';
      const dimensions = sizeOf(filePath);
      width = dimensions.width;
      height = dimensions.height;
    } else if (req.file.mimetype.startsWith('video')) {
      mediaType = 'video';
      // You can extract video metadata if needed
    } else {
      return res.status(400).json({ error: 'Unsupported media type' });
    }

    const newPost = new Post({
      caption,
      mediaType,
      mediaPath: filePath,
      author,
      imageWidth: width,
      imageHeight: height,
    });

    const user = await User.findById(author);
    user.posts.push(newPost._id);
    await user.save();
    await newPost.save();

    res.status(201).json({ newPost, width, height });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username profilePicture').populate('comments.user', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



const like = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.pull(req.body.userId);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const getComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture'); // Include profilePicture

    // console.log(post);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.savedPosts.includes(req.body.postId)) {
      user.savedPosts.push(req.body.postId);
    } else {
      user.savedPosts.pull(req.body.postId);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const writeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    post.comments.push({ user: req.body.userId, text: req.body.text, profilePicture: user.profilePicture });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Define other controller methods here...

module.exports = { createPost, getAllPosts, like, getComment, savePost, getSavedPosts, writeComment };
