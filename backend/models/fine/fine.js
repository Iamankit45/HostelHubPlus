// models/Fine.js
const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    imposedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fine', FineSchema);
