const Student = require('../../models/student/student.js');
const Hostel = require('../../models/Hostel/hostel.js');
const Room = require('../../models/Hostel/room.js');
const Notification = require('../../models/notification/notification.js');


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
const allotRooms = async (hostelId,requserId) => {
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
            return { status: 200, message: 'All students already have rooms allocated' };
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

            const notification = new Notification({
                sender: requserId, // Assuming the user who makes the request is the sender
                recipient: student._id,
                message: `You have been assigned Room ${room.roomNumber} in ${hostel.name}`
            });
            await notification.save();
        }

        const updatedHostel = await Hostel.findById(hostelId).populate('students');
        const updatedRooms = await Room.find({ hostel: hostelId });

        return { status: 200, message: 'Rooms allotted successfully', hostel: updatedHostel, rooms: updatedRooms };
    } catch (error) {
        console.error('Error allotting rooms:', error);
        return { status: 500, message: 'Error allotting rooms', error };
    }
};


exports.allotRoomsToStudents = async (req, res) => {
    const { hostelId } = req.params;
    
    const result = await allotRooms(hostelId,req.user.userId);

    res.status(result.status).json({ message: result.message, hostel: result.hostel, rooms: result.rooms });
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

        const updatedHostel = await Hostel.findById(hostelId).populate('students');
        const updatedRooms = await Room.find({ hostel: hostelId });


        res.status(200).json({ message: 'Room allotments for the hostel removed successfully',hostel: updatedHostel, rooms: updatedRooms });
    } catch (error) {
        res.status(500).json({ message: 'Error removing room allotments for the hostel', error });
    }
};


// Controller function to reassign a student to a different room
exports.reassignStudentRoom = async (req, res) => {
    const { studentId, newRoomId } = req.body;

    try {
        const student = await Student.findById(studentId);
        const newRoom = await Room.findById(newRoomId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!newRoom || newRoom.availableSeats <= 0) {
            return res.status(400).json({ message: 'New room is not available' });
        }

        // Find the current room of the student
        const currentRoom = await Room.findById(student.room);

        // Remove the student from the current room
        if (currentRoom) {
            currentRoom.occupants = currentRoom.occupants.filter(id => id.toString() !== student._id.toString());
            currentRoom.availableSeats += 1;
            if (currentRoom.availableSeats > 0) {
                currentRoom.status = 'available';
            }
            await currentRoom.save();
        }

        // Add the student to the new room
        newRoom.occupants.push(student._id);
        newRoom.availableSeats -= 1;
        if (newRoom.availableSeats === 0) {
            newRoom.status = 'occupied';
        }
        await newRoom.save();

        // Update the student's room reference
        student.room = newRoom._id;
        await student.save();

        console.log(studentId);
        const notification = new Notification({
            sender: req.user.userId, // Assuming the user who makes the request is the sender
            recipient:studentId,
            message: `You have been assigned new Room ${newRoom.roomNumber}`
        });
        await notification.save();

        res.status(200).json({ message: 'Student reassigned successfully', hostel: student.hostel });
    } catch (error) {
        console.error('Error reassigning student:', error);
        res.status(500).json({ message: 'Error reassigning student', error });
    }
};


// Controller function to swap rooms between two students
exports.swapStudentRooms = async (req, res) => {
    const { studentId1, studentId2 } = req.body;

    try {
        const student1 = await Student.findById(studentId1);
        const student2 = await Student.findById(studentId2);

        if (!student1 || !student2) {
            return res.status(404).json({ message: 'One or both students not found' });
        }

        // Find the current rooms of both students
        const room1 = await Room.findById(student1.room);
        const room2 = await Room.findById(student2.room);

        if (!room1 || !room2) {
            return res.status(400).json({ message: 'One or both rooms not found' });
        }

        // Swap the students in their respective rooms
        room1.occupants = room1.occupants.filter(id => id.toString() !== student1._id.toString());
        room2.occupants = room2.occupants.filter(id => id.toString() !== student2._id.toString());

        room1.occupants.push(student2._id);
        room2.occupants.push(student1._id);

        await room1.save();
        await room2.save();

        // Swap the room references in the students' records
        const tempRoomId = student1.room;
        student1.room = student2.room;
        student2.room = tempRoomId;

        await student1.save();
        await student2.save();

        const notification1 = new Notification({
            sender: req.user.userId, // Assuming the user who makes the request is the sender
            recipient: student1._id,
            message: `You Room has been succesfully swapped to  Room ${room2.roomNumber}`
        });
        await notification1.save();

        const notification2 = new Notification({
            sender: req.user.userId, // Assuming the user who makes the request is the sender
            recipient: student2._id,
            message: `You Room has been succesfully swapped to  Room ${room1.roomNumber}`
        });
        await notification2.save();


        res.status(200).json({ message: 'Rooms swapped successfully', hostel: student1.hostel });
    } catch (error) {
        console.error('Error swapping rooms:', error);
        res.status(500).json({ message: 'Error swapping rooms', error });
    }
};
