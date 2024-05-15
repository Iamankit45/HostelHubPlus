import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';


import { FaUserAlt, FaDoorOpen, FaExchangeAlt } from 'react-icons/fa';

const ManualRoomAllocation = () => {
    const { id } = useParams();
    const privateApi = useAxiosPrivate();
    const [hostelName, setHostelName] = useState('');
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [student1, setStudent1] = useState(null);
    const [student2, setStudent2] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {

                const hostelResponse = await privateApi.get(`/hostel/${id}`);
                setHostelName(hostelResponse.data.hostel.name);

                // console.log(hostelResponse.data.hostel.name)

                const studentResponse = await privateApi.get(`/hostel/${id}/students`);
                // console.log(studentResponse.data);
                setStudents(studentResponse.data);

                const roomResponse = await privateApi.get(`/hostel/${id}/rooms`);
                // console.log(roomResponse.data.rooms);
                setRooms(roomResponse.data.rooms);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        fetchDetails();
    }, [id, privateApi]);

    const handleReassign = async () => {
        if (!selectedStudent || !selectedRoom) {
            alert('Please select both a student and a room.');
            return;
        }
        const student = students.find(s => s._id === selectedStudent.value);
        const currentRoom = rooms.find(r => r.occupants.includes(student._id));

        if (currentRoom && currentRoom._id === selectedRoom.value) {
            alert('The student is already in the selected room. Please choose a different room.');
            return;
        }

        try {
            const response = await privateApi.post('/room/reassign-room', { studentId: selectedStudent.value, newRoomId: selectedRoom.value });
            alert(response.data.message);
            window.location.reload(); // Reload the page to update the details
        } catch (error) {
            console.error('Error reassigning room:', error);
            alert(error.response?.data?.message || 'Error reassigning room');
        }
    };

    const handleSwap = async () => {
        if (!student1 || !student2 || student1.value === student2.value) {
            alert('Please select two different students.');
            return;
        }

        else if (getStudentRoom(student1.value) === getStudentRoom(student2.value)) {
            alert('Please select two different rooms.');
            return;
        }

        try {
            const response = await privateApi.post('/room/swap-rooms', { studentId1: student1.value, studentId2: student2.value });
            alert(response.data.message);
            window.location.reload(); // Reload the page to update the details
        } catch (error) {
            console.error('Error swapping rooms:', error);
            alert(error.response?.data?.message || 'Error swapping rooms');
        }
    };
    const getStudentRoom = (studentId) => {
        const student = students.find(s => s._id === studentId);
        const room = rooms.find(r => r.occupants.includes(studentId));
        return room ? room.roomNumber : 'No room assigned';
    };
    const studentOptions = students.map(student => ({
        value: student._id,
        label: `${student.username} (${student.programme} - ${student.batch}) - Current Room: ${getStudentRoom(student._id)}`
    }));

    const roomOptions = rooms.filter(room => room.availableSeats > 0).map(room => ({
        value: room._id,
        label: `${room.roomNumber} - Vacant Seats: ${room.availableSeats}`
    }));

    return (
        <div className="container mt-5" style={{ maxWidth: '800px',margin: 'auto '}}>
            <h2 className="text-center mb-4">Manual Room Allocation For {hostelName} </h2>
            
            <div className="card mb-4 p-4 shadow-sm " >
                <h3 className="mb-3"style={{ color:'#007bff',display:'flex',alignItems: 'center' }} ><FaDoorOpen/>Reassign Room</h3>
                <div className="form-group">
                    <label>Select Student</label>
                    <Select
                        options={studentOptions}
                        onChange={setSelectedStudent}
                        value={selectedStudent}
                        placeholder="Select a student"
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Select New Room</label>
                    <Select
                        options={roomOptions}
                        onChange={setSelectedRoom}
                        value={selectedRoom}
                        placeholder="Select a room"
                    />
                </div>
                <button className="btn btn-primary mt-3 w-100" onClick={handleReassign}>
                    <FaExchangeAlt /> Reassign Room
                </button>
            </div>

            <div className="card mb-4 p-4 shadow-sm" style={{}}>
                <h3 className="mb-3" style={{ color:'#007bff',display:'flex',alignItems: 'center' }}><FaExchangeAlt /> Swap Rooms</h3>
                <div className="form-group">
                    <label>Select Student 1</label>
                    <Select
                        options={studentOptions}
                        onChange={setStudent1}
                        value={student1}
                        placeholder="Select a student"
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Select Student 2</label>
                    <Select
                        options={studentOptions}
                        onChange={setStudent2}
                        value={student2}
                        placeholder="Select a student"
                    />
                </div>
                <button className="btn btn-primary mt-3 w-100" onClick={handleSwap}>
                    <FaExchangeAlt /> Swap Rooms
                </button>
            </div>
        </div>
    );
};

export default ManualRoomAllocation;
