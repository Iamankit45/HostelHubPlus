const mongoose = require('mongoose');

const wardenSchema = new mongoose.Schema({

    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    // required: true,
  },
});

module.exports = mongoose.model('Warden', wardenSchema);
