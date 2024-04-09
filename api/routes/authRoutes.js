// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
require('dotenv').config();
 

// signup route
router.post("/signup", async (req, res) => {
  try {
    // check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already taken" });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      userType: req.body.userType,
    });
    // save the user to the database
    await newUser.save();
    // generate a token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
    // send the token and the user info as a response
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    // handle any errors
    res.status(500).json({ message: error.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    // find the user by username
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // compare the password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }
    // generate a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // send the token and the user info as a response
    res.status(200).json({ token, user });
    
  } catch (error) {
    // handle any errors
    res.status(500).json({ message: error.message });
  }
});


router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // The user is authenticated; get the user's ID
    const userId = req.user._id;

    // Fetch user details from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract necessary user details
    const { username, email, userType } = user;

    // Send the user details in the response
    res.json({ username, email, userType });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Middleware to authenticate token
function authenticateToken(req, res, next) {
  // Extract token from header or query parameter
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = router;
