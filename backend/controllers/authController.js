const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID");

const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, username, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    res.status(201).json({ message: 'User registered', newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,           // ✅ required for HTTPS
      sameSite: 'None',          // 1 hour
    });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const isLoggedIn = async (req, res) => {
  if (req.cookies.token) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'None'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // If user doesn't exist, create a new one
      // Generate a random password since they use Google to login
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), 10);
      
      // Derive a unique username
      let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      let username = baseUsername;
      let counter = 1;
      
      // Ensure username is unique
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      user = new User({
        fullName: name,
        username: username,
        email: email,
        password: randomPassword,
        profilePicture: picture || 'https://res.cloudinary.com/dnfgqymkx/image/upload/v1742125751/posts/gjy3cjrgbr9zoumukiju.png'
      });
      
      await user.save();
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    
    // Return token and user data matching the normal login response
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google Auth Error: ", error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
};

module.exports = { register, login, isLoggedIn, logout, googleAuth };
