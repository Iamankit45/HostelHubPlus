import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Table, Header, Container } from 'semantic-ui-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeSlots = [
    '7:00 AM - 10:00 AM',
    '10:00 AM - 01:00 PM',
    '01:00 PM - 05:00 PM',
    '05:00 PM - 10:00 PM',
];

const StaffScheduleForm = () => {
    const privateApi = useAxiosPrivate();
    const [staffSchedule, setStaffSchedule] = useState({});
    const [staffOptions, setStaffOptions] = useState([]);
    const [hostelOptions, setHostelOptions] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState('');
    const [weekStartDate, setWeekStartDate] = useState('');
    const [hostelName, setHostelName] = useState('');
    const hostelId = localStorage.getItem('hostelId');

    useEffect(() => {
        const fetchStaff = async () => {
            try {
               
                const response = await privateApi.get(`/staff/hostel-cleaner/${hostelId}`);
                const options = response.data.map(staff => ({
                    key: staff._id,
                    value: staff._id,
                    text: staff.username,
                }));
                setStaffOptions(options);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        const fetchHostels = async () => {
            
            try {
                const response = await privateApi.get(`/hostel/${hostelId}`);
                console.log(response.data.hostel.name)
                setSelectedHostel(hostelId)
                setHostelName(response.data.hostel.name);

            } catch (error) {
                console.error('Error fetching hostels:', error);
            }
        };

        fetchStaff();
        fetchHostels();
    }, [privateApi]);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (selectedHostel && weekStartDate) {
                try {
                    const response = await privateApi.get('/staff/schedule', {
                        params: { hostel: selectedHostel, weekStartDate },
                    });
                    const scheduleData = response.data.schedule || {};

                    const transformedSchedule = {};
                    for (const day of daysOfWeek) {
                        transformedSchedule[day] = {};
                        if (scheduleData[day.toLowerCase()]) {
                            for (const { timeSlot, staff } of scheduleData[day.toLowerCase()]) {
                                transformedSchedule[day][timeSlot] = staff;
                            }
                        }
                    }
                    setStaffSchedule(transformedSchedule);
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                }
            }
        };
        fetchSchedule();
    }, [selectedHostel, weekStartDate, privateApi]);

    const handleChange = (day, timeSlot, staff) => {
        const updatedSchedule = { ...staffSchedule };
        if (!updatedSchedule[day]) {
            updatedSchedule[day] = {};
        }
        updatedSchedule[day][timeSlot] = staff;
        setStaffSchedule(updatedSchedule);
    };

    const handleSubmit = async () => {
        try {
            const cleanedSchedule = { ...staffSchedule };
            await privateApi.post('/staff/schedule/create', {
                hostel: selectedHostel,
                weekStartDate,
                schedule: cleanedSchedule,
            });
            alert('Staff schedule saved successfully.');
            window.location.reload();
        } catch (error) {
            console.error('Error saving staff schedule:', error);
            alert('Error saving staff schedule. Please try again.');
        }
    };

    return (
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <Header as="h2" textAlign="center" style={{ margin: '20px 0' }}>Staff  Schedule</Header>

            <Form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', borderRadius: '15px', boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)' }}>
                <Header textAlign="center" >{hostelName}</Header>

                <Form.Field>
                    <label>Week Start Date</label>
                    <DatePicker
                        selected={weekStartDate}
                        onChange={date => setWeekStartDate(date)}
                        minDate={new Date()} // Disable past dates
                        filterDate={date => date.getDay() === 0} // Only allow selecting Sundays
                    />
                </Form.Field>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {daysOfWeek.map(day => (
                        <div key={day} className="day-schedule">
                            <Header as="h3" style={{ marginTop: '20px' }}>{day}</Header>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Time Slot</Table.HeaderCell>
                                        <Table.HeaderCell>Assigned Staff</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {timeSlots.map(timeSlot => (
                                        <Table.Row key={timeSlot}>
                                            <Table.Cell>{timeSlot}</Table.Cell>
                                            <Table.Cell>
                                                <Dropdown
                                                    selection
                                                    options={staffOptions}
                                                    value={staffSchedule[day]?.[timeSlot] || ''}
                                                    onChange={(e, { value }) => handleChange(day, timeSlot, value)}
                                                    placeholder="Select Staff"
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    ))}
                </div>
                <br></br>
                <Button type="submit" primary>Save Schedule</Button>
            </Form>
        </Container>
    );
};

export default StaffScheduleForm;
