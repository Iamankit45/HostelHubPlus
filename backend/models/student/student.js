// models/student/student.js

const mongoose = require('mongoose');

// Define Student Schema
const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    programme: {
        type: String,
        required: false
    },
    batch: {
        type: String,
        required: false
    },
    rollno:{
        type: String,
    },
    
    
    fathersName: {
        type: String,
        required: false
    },
    mothersName: {
        type: String,
        required: false
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: false
    },
    roomNo: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    parentContactNo: {
        type: String,
        required: false
    }
});

// Create Student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
