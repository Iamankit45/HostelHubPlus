// models/user/user.js

const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'caretaker', 'warden', 'hosteladmin'],
    required: true
  }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
