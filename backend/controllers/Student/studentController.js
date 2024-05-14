const Student = require('../../models/student/student.js');



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
