// staffSchedule.model.js

const mongoose = require('mongoose');

const staffScheduleSchema = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    // Define the schedule for each day of the week
    monday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    tuesday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    wednesday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    thursday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    friday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    saturday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
    sunday: [
        { timeSlot: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' } }
    ],
});

const StaffSchedule = mongoose.model('StaffSchedule', staffScheduleSchema);

module.exports = StaffSchedule;
