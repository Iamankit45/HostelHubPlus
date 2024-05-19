// models/Complaint.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    complaint: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    remark: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
