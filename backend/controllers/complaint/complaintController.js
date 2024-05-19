const Hostel = require('../../models/Hostel/hostel.js');
const Room = require('../../models/Hostel/room.js');
const Student = require('../../models/student/student.js');
const Caretaker = require('../../models/caretaker/caretaker.js');
const Warden = require('../../models/warden/warden.js');

const Notification = require('../../models/notification/notification.js');


const Complaint = require('../../models/complaint/complaint.js');


exports.registerComplaint = async (req, res) => {
    const { complaint } = req.body;
    const hostelId = req.params.hostelId;
    const studentId = req.user.userId;
    const username = req.user.username;

    // console.log(username);

    try {
        const hostel = await Hostel.findById(hostelId);
        const student=await Student.findById(studentId);
        // console.log(student.username);
        if (!hostel) {
            return res.status(404).json({ error: 'Hostel not found' });
        }

        const newComplaint = new Complaint({
            student: studentId,
            hostel: hostelId,
            complaint
        });

        await newComplaint.save();

        // Find the caretaker for the hostel
        const caretaker = await Caretaker.findOne({hostel: hostelId });
        if (caretaker) {
            // Create notification for caretaker
            const notification = new Notification({
                sender: studentId,
                recipient: caretaker._id,
                message: `New complaint registered by ${student.username}: ${complaint}`
            });
            await notification.save();
        }
        // Create a notification for the student
        
        
        res.status(201).json({ message: 'Complaint registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering complaint' });
    }
};

exports.getComplaints = async (req, res) => {
    const hostelId = req.params.hostelId;

    try {
        const complaints = await Complaint.find({ hostel: hostelId }).populate('student', 'username');
        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching complaints' });
    }
};


exports.resolveComplaint = async (req, res) => {
    const complaintId = req.params.complaintId;
    const { remark } = req.body;

    try {
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        complaint.status = 'resolved';
        complaint.remark = remark;
        await complaint.save();

        // Create notification for the student
        const notification = new Notification({
            sender: req.user.userId,
            recipient: complaint.student,
            message: `Your complaint has been resolved with the following remark: ${remark}`
        });
        await notification.save();

        res.status(200).json({ message: 'Complaint resolved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error resolving complaint' });
    }
};


exports.studentComplaint= async (req, res) => {
    const userId = req.user.userId
    // console.log(userId);

    try {
        // Query the database to find complaints by user ID
        const complaints = await Complaint.find({ student: userId }).sort({ createdAt: -1 });
        // console.log(complaints);
        res.status(200).json({ complaints });
    } catch (error) {
        console.error('Error fetching complaints by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};