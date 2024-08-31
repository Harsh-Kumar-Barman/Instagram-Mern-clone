const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const expressSession = require('express-session')
const passport = require('passport')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const sizeOf = require('image-size');

const User = require('./models/userSchema');
const Post = require('./models/postSchema');
const { clearScreenDown } = require('readline');

const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "shhhh"
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token)
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/isLoggin', async (req, res) => {
  if (req.cookies.token) {  // Check if the token exists and is not empty
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false }); // 401 Unauthorized
  }
});

app.get('/api/logout', async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true, // Ensure the cookie is only accessible by the web server
    expires: new Date(0), // Set expiration to a past date to clear the cookie
    secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
    sameSite: 'strict' // Prevent CSRF attacks
  });
  res.status(200).json({ message: 'Logged out successfully' }); // Send response
});



// app.post('/api/posts', upload.single('image'), async (req, res) => {
//   try {
//     const { caption, author } = req.body;
//     const newPost = new Post({ caption, image: req.file.path, author });
//     const user= await User.findOne({_id:author})
//     user.posts.push(newPost._id)
//     await user.save()
//     await newPost.save();

//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { caption, author } = req.body;
    const dimensions = sizeOf(req.file.path);
    const width = dimensions.width;
    const height = dimensions.height;
    const newPost = new Post({
      caption,
      image: req.file.path,
      author,
      imageWidth: width,
      imageHeight: height
    });
    const user = await User.findOne({ _id: author });
    user.posts.push(newPost._id);
    await user.save();
    await newPost.save();
    // console.log("width :: ",width)
    // console.log("height :: ",height)
    res.status(201).json({ newPost, width, height });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/:username/posts', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username');
    // console.log(posts)
    res.json({ user, posts });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username }).select('-password'); // Exclude the password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find posts by the user's ID
    const posts = await Post.find({ author: user._id })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username');

    res.json({ user, posts });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/userss/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user by username
    const user = await User.findOne({ email }).select('-password'); // Exclude the password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user, });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.put('/api/posts/:id/like', async (req, res) => {
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
});

app.put('/api/user/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const followingUser = await User.findById(req.body.followingID);
    if (!user.following.includes(req.body.followingID)) {
      user.following.push(req.body.followingID);
    } else {
      user.following.pull(req.body.followingID);
    }
    if (!followingUser.followers.includes(req.params.id)) {
      followingUser.followers.push(req.params.id);
    } else {
      followingUser.followers.pull(req.params.id);
    }
    await user.save();
    await followingUser.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/posts/:id/save', async (req, res) => {
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
});

app.get('/api/posts/:id/save', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.body.userId, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username profilePicture').populate('comments.user', 'username');

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username profilePicture').populate('comments.user', 'username');
    console.log(posts)
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    console.log(req.query.query);
    const query = req.query.query
    const results = await User.find({ username: { $regex: query, $options: 'i' } }).select(['username','fullName','profilePicture']);
    console.log('user found  :  :  :  ', results)

    if (results) {
      res.json(results);
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
