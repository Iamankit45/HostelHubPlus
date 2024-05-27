const Student = require('../../models/student/student.js');
const Attendance = require('../../models/student/attendance.js')
const LeaveRequest = require('../../models/student/leave.js')
const Caretaker = require('../../models/caretaker/caretaker.js');
const Notification = require('../../models/notification/notification.js');
const User = require('../../models/user/user');
const Warden = require('../../models/warden/warden.js');
const bcrypt = require('bcrypt');

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
        res.status(200).json({ studentAttendance });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



//for leave

// Function to create a new leave request
exports.createLeaveRequest = async (req, res) => {

    const studentId = req.user.userId;


    try {

        const student = await Student.findById({ _id: studentId });
        const hostel = student.hostel;
        const { startDate, endDate, reason } = req.body;
        const newLeaveRequest = await LeaveRequest.create({
            student,
            hostel,
            startDate,
            endDate, reason
        });

        // Create notification for the caretaker
        const warden = await Warden.findOne({ hostel: hostel });


        if (warden) {
            const notification = new Notification({
                sender: req.user.userId,
                recipient: warden._id,
                message: ` ${student.username} has requested for leave`
            });
            await notification.save();
        }



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
        const leaveRequests = await LeaveRequest.find({ hostel: hostelId }).populate('student').sort({ createdAt: -1 });;
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


// Register a new student
exports.registerStudent = async (req, res) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
        const { username, password, studentInfo } = req.body;

        // console.log(req.body);

        // Validate username uniqueness
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ username, password: hashedPassword, role: 'student' });
        await newUser.save({ session });

        // Create student with reference to the new user's _id
        const student = new Student({ _id: newUser._id, username, ...studentInfo });
        await student.save({ session });

        await session.commitTransaction();
        session.endSession();



        res.status(201).json({ message: 'Student registered successfully', student: student, user: newUser });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};


exports.getAllStudent = async (req, res) => 
{
    try {
       const students= await Student.find();

       res.status(200).json({student: students})
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}


exports.requestRoomChange = async (req, res) => {
    try {
      const { message,hostelId } = req.body;
      const studentId = req.user.userId;
  
      // Fetch the student's details
      const student = await Student.findById({ _id: studentId });
      const hostel = student.hostel;
     
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Fetch the caretaker for the student's hostel
      const caretaker = await Caretaker.findOne({ hostel: hostel });
  
      if (!caretaker) {
        return res.status(404).json({ message: 'Caretaker not found' });
      }
  
      // Create and save the notification
      const notification = new Notification({
        sender: studentId,
        recipient: caretaker._id,
        message: `${student.username} has requested for room change: ${message}`
      });
  
      await notification.save();
  
      res.status(201).json({ message: 'Room change request sent successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };