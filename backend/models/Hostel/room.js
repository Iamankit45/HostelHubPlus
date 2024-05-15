const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  hostelName: {
    type: String,
    required: true,
  },
  roomType: { type: String, required: true, enum: ['Single Seater', 'Double Seater', 'Triple Seater'] },
  roomNumber: { type: String, required: true },
  status: { type: String, required: true, enum: ['available', 'occupied'], default: 'available' },
  occupants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  availableSeats: {
    type: Number,
    required: true,
  },
});



const Room = mongoose.model('Room', roomSchema);
module.exports = Room;

