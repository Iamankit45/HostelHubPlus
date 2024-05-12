// models/staff/staff.js

const mongoose = require('mongoose');

// Define Staff Schema
const staffSchema = new mongoose.Schema({
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
  staffType: {
    type: String
  }
});

// Create Staff model
const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
