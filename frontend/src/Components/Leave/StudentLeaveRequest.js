// StudentLeaveRequest.js

import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Form, TextArea, Button, Message, Segment, Header, Icon } from 'semantic-ui-react';

const StudentLeaveRequest = () => {
    const privateApi = useAxiosPrivate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleSubmit = () => {
        const hostelId = localStorage.getItem('hostelId');
        privateApi.post(`/student/leave/create-leave/`, { startDate, endDate, reason })
            .then(() => {
                setMessage('Leave request submitted successfully');
                setStartDate('');
                setEndDate('');
                setReason('');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            })
            .catch(error => {
                console.error('Error submitting leave request:', error);
                setMessage('Error submitting leave request');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            });
    };

    return (
        <Segment className="student-leave-request-segment" raised style={{ width: '50%', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="calendar alternate outline" />
                Apply for Leave
            </Header>
            <Form>
                <Form.Field>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
                </Form.Field>
                <Form.Field>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
                </Form.Field>
                <Form.Field>
                    <label>Reason</label>
                    <TextArea
                        placeholder="Enter reason for leave"
                        value={reason}
                        onChange={handleReasonChange}
                    />
                </Form.Field>
                <Button onClick={handleSubmit} primary fluid>
                    <Icon name="paper plane" />
                    Submit Leave Request
                </Button>
            </Form>
            {message && <Message positive className="student-leave-request-message">{message}</Message>}
        </Segment>
    );
};

export default StudentLeaveRequest;
