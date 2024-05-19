const Student = require('../../models/student/student.js');

const Caretaker = require('../../models/caretaker/caretaker.js');
const Notification = require('../../models/notification/notification.js');
const User = require('../../models/user/user');

const Fine = require('../../models/fine/fine.js');





exports.imposeFine = async (req, res) => {
    const { studentId, amount, reason } = req.body;
    try {
        const student = await Student.findById(studentId);
        const hostel = student.hostel;

        const newFine = new Fine({
            student: studentId,
            hostel,
            amount,
            reason
        });
        await newFine.save();

        // Create notification for the student
        const notification = new Notification({
            sender: req.user.userId,
            recipient: studentId,
            message: `A fine of ${amount} has been imposed on you for: ${reason}`
        });
        await notification.save();

        res.status(201).json(newFine);
    } catch (error) {
        console.error('Error imposing fine:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFinesForStudent = async (req, res) => {
    const studentId = req.user.userId;
    try {
        const fines = await Fine.find({ student: studentId }).populate('hostel');
        res.status(200).json(fines);
    } catch (error) {
        console.error('Error fetching fines for student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFinesForCaretaker = async (req, res) => {
    const hostelId = req.params.hostelId;
    try {
        const fines = await Fine.find({ hostel: hostelId }).populate('student');
        res.status(200).json(fines);
    } catch (error) {
        console.error('Error fetching fines for caretaker:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.payFine = async (req, res) => {
    const fineId = req.params.fineId;
    try {
        const fine = await Fine.findByIdAndUpdate(fineId, { status: 'paid' }, { new: true });
        res.status(200).json(fine);
    } catch (error) {
        console.error('Error paying fine:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


