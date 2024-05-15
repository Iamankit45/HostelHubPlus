const Hostel = require('../../models/Hostel/hostel.js');
const Room = require('../../models/Hostel/room.js');
const Student = require('../../models/student/student.js');

// Create a new hostel with room details
exports.createHostel = async (req, res) => {
    const { name, singleSeater, doubleSeater, tripleSeater } = req.body;

    try {
        // Calculate total rooms and max occupancy
        const totalRooms = singleSeater + doubleSeater + tripleSeater;
        const maxOccupancy = singleSeater * 1 + doubleSeater * 2 + tripleSeater * 3;

        // Create the hostel
        const hostel = new Hostel({
            name,
            singleSeater,
            doubleSeater,
            tripleSeater,
            totalRooms,
            maxOccupancy,
        });
        await hostel.save();

        // Create rooms based on the provided details
        const roomTypes = [
            { type: 'Single Seater', quantity: singleSeater, prefix: 'S' },
            { type: 'Double Seater', quantity: doubleSeater, prefix: 'D' },
            { type: 'Triple Seater', quantity: tripleSeater, prefix: 'T' },
        ];

        let roomNumber = 1;
        for (const roomType of roomTypes) {
            for (let i = 0; i < roomType.quantity; i++) {
                const availableSeats = roomType.type === 'Single Seater' ? 1 : roomType.type === 'Double Seater' ? 2 : 3;

                const newRoom = new Room({
                    hostel: hostel._id,
                    hostelName: hostel.name,
                    roomType: roomType.type,
                    roomNumber: roomType.prefix + roomNumber++, // Prefix room number
                    status: 'available',
                    occupants: [], // Initialize occupants array
                    availableSeats: availableSeats,
                });
                await newRoom.save();
            }
        }

        res.status(201).json(hostel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Remove a hostel and its linked rooms
exports.removeHostel = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the hostel by ID
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        // Delete all rooms linked to the hostel
        await Room.deleteMany({ hostel: hostel._id });

        // Remove the hostel
        await Hostel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Hostel and linked rooms deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHostels = async (req, res) => {
    try {
        const hostels = await Hostel.find();
        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get detailed information about a specific hostel
exports.getHostelDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return res.status(404).json({ error: 'Hostel not found' });
        }

        // Find rooms and populate occupants with their username and batch
        const rooms = await Room.find({ hostel: id }).populate('occupants', 'username batch');

        res.status(200).json({
            hostel,
            rooms
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.allotHostel = async (req, res) => {
    try {
        const { hostelId, studentIds } = req.body;
        const hostel = await Hostel.findById(hostelId);

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        // Check current hostels of the students
        const students = await Student.find({ _id: { $in: studentIds } });

        for (let student of students) {
            // Remove student from the previous hostel if they were allotted one
            if (student.hostel) {
                await Hostel.findByIdAndUpdate(student.hostel, {
                    $pull: { students: student._id }
                });
            }

            // Update the student's hostel
            await Student.findByIdAndUpdate(student._id, { hostel: hostelId });

            // Add student to the new hostel
            await Hostel.findByIdAndUpdate(hostelId, {
                $addToSet: { students: student._id }
            });
        }


        res.status(200).json({ message: 'Hostel allotted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error allotting hostel', error });
    }
}

exports.getStudentsByHostel = async (req, res) => {
    try {
      const { hostelId } = req.params;
  
      // Find the hostel by ID to ensure it exists
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }
  
      // Find students assigned to this hostel
      const students = await Student.find({ hostel: hostelId });
  
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students for the hostel', error });
    }
  };