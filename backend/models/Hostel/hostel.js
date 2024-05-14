const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  singleSeater: { type: Number, required: true },
  doubleSeater: { type: Number, required: true },
  tripleSeater: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  maxOccupancy: { type: Number, required: true },
});

const Hostel = mongoose.model('Hostel', hostelSchema);
module.exports = Hostel;
