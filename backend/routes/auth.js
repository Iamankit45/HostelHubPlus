// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user/user');

const auth_router = express.Router();

// Login route
auth_router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id ,role: user.role}, '75b33bcaf37ee6058def91bd2f88bd7c0e94f5f307a3a7b3d20e4a1ab4e9a0daec78bd5b49453b15e851c68bb818bcf73857038e6321066eb14e9a064c89dd84', { expiresIn: '1h' });

    // Send token, userId, and role in response
    res.json({ token, userId: user._id,username:user.username, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

auth_router.delete('/logout', async(req, res) => {
    try {
        res.clearCookie('jwt');
        
        
        res.status(200).send('user logout');
      } catch (error) {
        console.log(error);
      }
    
  });

module.exports = auth_router;
