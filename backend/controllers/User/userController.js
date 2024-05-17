// controllers/user/userController.js
const bcrypt = require('bcrypt');
const User = require('../../models/user/user');

const Student = require('../../models/student/student');

const Caretaker =require('../../models/caretaker/caretaker');
const Warden =require('../../models/warden/warden');


const mongoose = require("mongoose");


// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate username uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    

    // Create the corresponding role entry with reference to the user ID and include the username
    if (role === 'student') {
      const student = new Student({ _id: newUser._id, username });
      await student.save();
  } else if (role === 'caretaker') {
      const caretaker = new Caretaker({ _id: newUser._id, username });
      await caretaker.save();
  } else if (role === 'warden') {
      const warden = new Warden({ _id: newUser._id, username });
      await warden.save();
  }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  // Implement logic to fetch user by ID
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  // Implement logic to update user by ID
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  // Implement logic to delete user by ID
};
