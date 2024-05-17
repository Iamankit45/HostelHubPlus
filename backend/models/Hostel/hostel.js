const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  singleSeater: { type: Number, required: true },
  doubleSeater: { type: Number, required: true },
  tripleSeater: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  maxOccupancy: { type: Number, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], 
  caretaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caretaker',
  },
  warden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warden',
  },

});

const Hostel = mongoose.model('Hostel', hostelSchema);
module.exports = Hostel;
