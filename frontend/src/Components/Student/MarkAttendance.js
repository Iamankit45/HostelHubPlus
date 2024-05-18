import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button, Dropdown, Message, Header, Input, Segment, Icon } from 'semantic-ui-react';

const MarkAttendance = () => {
    const privateApi = useAxiosPrivate();
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState('');
    const [attendance, setAttendance] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const fetchAttendanceForDate = (date) => {
        const hostelId = localStorage.getItem('hostelId');
        privateApi.get(`/student/attendance/${hostelId}/${date}`)
            .then(response => {
                const attendanceMap = {};
                response.data.records.forEach(record => {
                    attendanceMap[record.student._id] = record.status;
                });
                setAttendance(attendanceMap);
                setStudents(response.data.records);
            })
            .catch(error => {
                console.error('Error fetching attendance records:', error);
            });
    };

    useEffect(() => {
        const hostelId = localStorage.getItem('hostelId');
        if (date) {
            fetchAttendanceForDate(date);
        }
    }, [date]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance({
            ...attendance,
            [studentId]: status
        });
    };

    const handleSubmit = () => {
        const attendanceRecords = Object.keys(attendance).map(studentId => ({
            studentId,
            status: attendance[studentId]
        }));

        const hostelId = localStorage.getItem('hostelId');

        privateApi.post(`student/updateAttendance/${hostelId}/${date}`, { attendances: attendanceRecords })
            .then(() => {
                setMessage('Attendance marked successfully');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            })
            .catch(error => {
                console.error('Error marking attendance:', error);
                setMessage('Error marking attendance');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            });
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        student.student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Segment className="mark-attendance-segment" raised style={{ Width: '60%', overflowY: 'auto !important' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="check circle outline" />
                Mark Attendance
            </Header>
            <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                fluid
                className="mark-attendance-date-input"
                icon="calendar alternate outline"
                iconPosition="left"
                placeholder="Select Date"
            />
            <Input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fluid
                className="mark-attendance-search-input"
                icon="search"
                iconPosition="left"
                placeholder="Search by Username"
            />
            <div style={{ overflowY: 'auto', maxHeight: '300px',margin: '20px auto'}}>
                <Table celled structured className="mark-attendance-table" >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Student Name</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Attendance</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredStudents.map(record => (
                            <Table.Row key={record.student._id}>
                                <Table.Cell>{record.student.username}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Dropdown 
                                        selection
                                        options={[
                                            { key: 'present', text: 'Present', value: 'present' },
                                            { key: 'absent', text: 'Absent', value: 'absent' },
                                        ]}
                                        value={attendance[record.student._id] || 'not marked'}
                                        onChange={(e, { value }) => handleAttendanceChange(record.student._id, value)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Button onClick={handleSubmit} disabled={!date} primary fluid>
                <Icon name="check" />
                Submit Attendance
            </Button>
            {message && <Message positive className="mark-attendance-message">{message}</Message>}
        </Segment>
    );
};

export default MarkAttendance;
