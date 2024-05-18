const Student = require('../../models/student/student.js');
const Attendance = require('../../models/student/attendance.js')



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
