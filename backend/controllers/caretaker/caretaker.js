const Student = require('../../models/student/student.js');
const Hostel = require('../../models/Hostel/hostel.js');
const Room = require('../../models/Hostel/room.js');

const Caretaker = require('../../models/caretaker/caretaker.js');
const Warden = require('../../models/warden/warden.js');



exports.getCaretakers=async(req,res)=>{
    try {
        const caretakers = await Caretaker.find();
        res.json(caretakers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}