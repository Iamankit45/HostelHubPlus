import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Segment, Header, Icon } from 'semantic-ui-react';

const StudentDashboard = () => {
    const privateApi = useAxiosPrivate();
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        // Fetch attendance data for the student
        privateApi.get('/student/get-attendance')
            .then(response => {
                setAttendance(response.data.studentAttendance);
            })
            .catch(error => {
                console.error('Error fetching attendance:', error);
            });
    }, [privateApi]);

    const formatDate = date => {
        return new Date(date).toLocaleDateString();
    };

    const markAttendance = date => {
        const formattedDate = formatDate(date);
        const attendanceRecord = attendance.find(record => formatDate(record.date) === formattedDate);
        if (attendanceRecord) {
            return attendanceRecord.status;
        }
        return null;
    };

    return (
        <Segment compact>
            <Header as="h3" textAlign="center">
                Attendance Calendar
            </Header>
            <Calendar
                tileContent={({ date, view }) => {
                    if (view === 'month') {
                        const status = markAttendance(date);
                        if (status === 'present') {
                            return <Icon name="check circle" color="green" />;
                        } else if (status === 'absent') {
                            return <Icon name="times circle" color="red" />;
                        }
                    }
                    return null;
                }}
                tileClassName="compact-calendar-tile"
                className="compact-calendar"
            />
        </Segment>
    );
};

export default StudentDashboard;
