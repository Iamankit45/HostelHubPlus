const Student = require('../../models/student/student.js');
const Hostel = require('../../models/Hostel/hostel.js');
const Room = require('../../models/Hostel/room.js');


// Function to sort students by program and roll number
const sortStudents = (students) => {
    const programs = ['CSE', 'ECE', 'MECH', 'DS', 'SM']; // Order of programs
    const batches = ['2019', '2020', '2021', '2022', '2023', '2024']; // Order of batches (update as needed)

    // Sort students by batch and roll number within each batch
    const sortedStudents = [];
    for (const batch of batches) {
        for (const program of programs) {
            const batchStudents = students.filter(student => student.batch === batch && student.programme === program);
            const sortedBatchStudents = batchStudents.sort((a, b) => a.rollno.localeCompare(b.rollno));
            sortedStudents.push(...sortedBatchStudents);
        }
    }

    return sortedStudents;
};
const allotRooms = async (hostelId) => {
    try {
        // Fetch the hostel details and populate student data
        const hostel = await Hostel.findById(hostelId).populate('students');
        if (!hostel) {
            return { status: 404, message: 'Hostel not found' };
        }

        // Fetch available rooms in the hostel
        const rooms = await Room.find({ hostel: hostelId, status: 'available' });
        const students = await Student.find({ hostel: hostelId });

        // Filter out students who already have a room allocated
        const studentsToAllot = students.filter(student => !student.room);
        if (studentsToAllot.length === 0) {
            return { status: 400, message: 'All students already have rooms allocated' };
        }

        // Group rooms by type
        const roomGroups = {
            single: rooms.filter(room => room.roomType === 'Single Seater'),
            double: rooms.filter(room => room.roomType === 'Double Seater'),
            triple: rooms.filter(room => room.roomType === 'Triple Seater')
        };


        // Sort students by branch and roll number
        const sortedStudents = sortStudents(studentsToAllot);

        // Allot rooms to students
        for (let student of sortedStudents) {
            let room = null;

            // Attempt to find an available room
            if (roomGroups.single.length > 0) {
                room = roomGroups.single[0];
            } else if (roomGroups.double.length > 0) {
                room = roomGroups.double[0];
            } else if (roomGroups.triple.length > 0) {
                room = roomGroups.triple[0];
            } else {
                return { status: 400, message: 'Not enough rooms available' };
            }

            // Assign room to student
            student.room = room._id;
            room.occupants.push(student._id);
            room.availableSeats -= 1;

            // Update room status if fully occupied
            if (room.availableSeats === 0) {
                room.status = 'occupied';
                // Remove the room from the group
                if (room.roomType === 'Single Seater') {
                    roomGroups.single.shift();
                } else if (room.roomType === 'Double Seater') {
                    roomGroups.double.shift();
                } else if (room.roomType === 'Triple Seater') {
                    roomGroups.triple.shift();
                }
            }

            await student.save();
            await room.save();
        }

        return { status: 200, message: 'Rooms allotted successfully' };
    } catch (error) {
        console.error('Error allotting rooms:', error);
        return { status: 500, message: 'Error allotting rooms', error };
    }
};


exports.allotRoomsToStudents = async (req, res) => {
    const { hostelId } = req.params;
    const result = await allotRooms(hostelId);

    res.status(result.status).json({ message: result.message });
};


// Controller function to remove room allotments for a specific hostel
exports.removeRoomAllotments = async (req, res) => {
    try {
      const hostelId = req.params.hostelId;
  
      // Find all rooms in the specified hostel
      const rooms = await Room.find({ hostel: hostelId });
  
      // Iterate over each room
      for (const room of rooms) {
        // If the room is not occupied, continue to the next room
        if (room.occupants.length === 0) {
          continue;
        }
  
        // Find all students who are occupants of this room
        const occupants = await Student.find({ _id: { $in: room.occupants } });
  
        // Iterate over each occupant and remove their room allotment
        for (const occupant of occupants) {
          // Reset the occupant's room ID
          occupant.room = null;
  
          // Save changes to the student
          await occupant.save();
        }

        // Calculate capacity based on room type
        let capacity = 0;
        if (room.roomType === 'Single Seater') {
            capacity = 1;
        } else if (room.roomType === 'Double Seater') {
            capacity = 2;
        } else if (room.roomType === 'Triple Seater') {
            capacity = 3;
        }
  
        // Clear the occupants array of the room and update available seats and status
        room.occupants = [];
        room.availableSeats = capacity;
        room.status = 'available';
  
        // Save changes to the room
        await room.save();
      }
  
      res.status(200).json({ message: 'Room allotments for the hostel removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing room allotments for the hostel', error });
    }
  };