const Student = require('../../models/student/student.js');
const Attendance = require('../../models/student/attendance.js')
const LeaveRequest =require('../../models/student/leave.js')
const Caretaker = require('../../models/caretaker/caretaker.js');
const Notification = require('../../models/notification/notification.js');
const User = require('../../models/user/user');

exports.getStudentDetails = async (req, res) => {
    try {
        const { batch } = req.query;
        if (!batch) {
            return res.status(400).json({ message: 'Batch is required' });
        }

        
        const students = await Student.find({ batch }).sort({ programme: 1, rollno: 1 }).populate('hostel', 'name');;

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

// Controller to mark attendance for multiple students
exports.updateAttendance = async (req, res) => {
    try {
        const { hostelId, date } = req.params;
        const { attendances } = req.body;

        let attendance = await Attendance.findOne({ hostel: hostelId, date });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        attendance.records.forEach(record => {
            const update = attendances.find(a => a.studentId === record.student.toString());
            
            if (update) {
                record.status = update.status;
            }
        });

        await attendance.save();

        res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAttendanceByDateAndHostel = async (req, res) => {
    try {
        const { hostelId, date } = req.params;

        let attendance = await Attendance.findOne({ hostel: hostelId, date }).populate('records.student');

        if (!attendance) {
            const students = await Student.find({ hostel: hostelId });
            const records = students.map(student => ({
                student: student._id,
                status: 'not marked'
            }));

            attendance = new Attendance({ hostel: hostelId, date, records });
            await attendance.save();
            attendance = await Attendance.findOne({ hostel: hostelId, date }).populate('records.student');

        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




// Controller to get attendance of specifc student 
exports.getAttendance = async (req, res) => {
    try {
        const studentId = req.user.userId; // Assuming student ID is stored in req.user

        // console.log(req.user.userId);
        // Fetch attendance records for the student
        const attendance = await Attendance.find({ 'records.student': studentId })
        
       
        const studentAttendance = [];
        // Iterate through attendance records to extract date and status for the student
        // Iterate through attendance records
        attendance.forEach(record => {
            let studentAttendanceRecord = { date: record.date, status: 'not marked' };

            // Iterate through records of each attendance record
            record.records.forEach(item => {
               
                // Check if the record corresponds to the desired student
                if (item.student.toString() === studentId) {
                    
                    studentAttendanceRecord.status = item.status;
                }
            });

            studentAttendance.push(studentAttendanceRecord);
        });
        
        // console.log(studentAttendance);
        res.status(200).json({ studentAttendance  });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



//for leave

// Function to create a new leave request
exports.createLeaveRequest = async (req, res) => {

    const studentId=req.user.userId;
    

    try {
        
        const student =await Student.findById({_id:studentId});
        const hostel=student.hostel;
        const {startDate, endDate,reason } = req.body;
        const newLeaveRequest = await LeaveRequest.create({
            student,
            hostel,
            startDate,
            endDate,reason
        });

        // Create notification for the caretaker
        const caretaker = await Caretaker.findOne({ hostel: hostel });

        

        
        const notification = new Notification({
            sender: req.user.userId,
            recipient: caretaker._id,
            message: ` ${student.username} has requested for leave`
        });
        await notification.save();

        res.status(201).json(newLeaveRequest);
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to get all leave requests for a student
exports.getLeaveRequestsForStudent = async (req, res) => {
    
    const studentId = req.user.userId;
    try {
        
        const leaveRequests = await LeaveRequest.find({ student: studentId }).populate('hostel');
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error('Error fetching leave requests for student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to get all leave requests for a hostel caretaker
exports.getLeaveRequestsForCaretaker = async (req, res) => {
    try {
        const hostelId = req.params.hostelId;
        // console.log(hostelId);
        const leaveRequests = await LeaveRequest.find({ hostel: hostelId }).populate('student');
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error('Error fetching leave requests for caretaker:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to approve a leave request
exports.approveLeaveRequest = async (req, res) => {
    try {
        const leaveRequestId = req.params.id;
       
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(leaveRequestId, { status: 'approved' });
       
        const notification = new Notification({
            sender: req.user.userId,
            recipient: updatedLeaveRequest.student,
            message: ` your leave request has been approved `
        });
        await notification.save();

        res.status(200).json(updatedLeaveRequest);
    } catch (error) {
        console.error('Error approving leave request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to reject a leave request
exports.rejectLeaveRequest = async (req, res) => {
    try {
        const leaveRequestId = req.params.id;
        const { caretakerRemark } = req.body;
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(leaveRequestId, { status: 'rejected', caretakerRemark }, { new: true });
        // console.log(updatedLeaveRequest);

        const notification = new Notification({
            sender: req.user.userId,
            recipient: updatedLeaveRequest.student,
            message: ` your leave request has been rejected `
        });
        await notification.save();
        res.status(200).json(updatedLeaveRequest);
    } catch (error) {
        console.error('Error rejecting leave request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};