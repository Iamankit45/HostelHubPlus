// models/faculty/faculty.js

const mongoose = require('mongoose');

// Define Faculty Schema
const facultySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String
  },
  address: {
    type: String
  },
  department: {
    type: String
  }
});

// Create Faculty model
const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
