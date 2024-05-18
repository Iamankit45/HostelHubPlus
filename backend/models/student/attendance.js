// models/attendance.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    date: { type: Date, required: true },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    records: [{
        student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['present', 'absent', 'not marked'], default: 'not marked' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
