// controllers/user/userController.js
const bcrypt = require('bcrypt');
const User = require('../../models/user/user');

const Student = require('../../models/student/student');
const Faculty = require('../../models/faculty/faculty');
const Staff = require('../../models/staff/staff');


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

    // If role is 'student', create student record
    if (role === 'student') {
      const newStudent = new Student({ username });
      await newStudent.save();
    }
    // If role is 'staff', create staff record
    else if (role === 'staff') {
      const newStaff = new Staff({ username });
      await newStaff.save();
    }
    // If role is 'faculty', create faculty record
    else if (role === 'faculty') {
      const newFaculty = new Faculty({ username });
      await newFaculty.save();
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
