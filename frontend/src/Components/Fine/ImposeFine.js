import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Form, Button, Message, Header, Icon, Segment, Dropdown } from 'semantic-ui-react';

const ImposeFine = () => {
    const privateApi = useAxiosPrivate();
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            const hostelId = localStorage.getItem('hostelId');
            try {
                const response = await privateApi.get(`/hostel/${hostelId}/students`);
                const studentOptions = response.data.map(student => ({
                    key: student._id,
                    text: student.username,
                    value: student._id,
                }));
                setStudents(studentOptions);
            } catch (error) {
                console.error('Error fetching students:', error);
                setMessage('Error fetching students');
            }
        };

        fetchStudents();
    }, []);

    const handleSubmit = async () => {
        try {
            await privateApi.post('/fine/impose-fine', { studentId, amount, reason });
            setMessage('Fine imposed successfully');
            setStudentId('');
            setAmount('');
            setReason('');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error imposing fine:', error);
            setMessage('Error imposing fine');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <Segment className="impose-fine-segment" raised style={{ width: '50%', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="exclamation circle" />
                Impose Fine
            </Header>
            <Form>
                <Form.Field>
                    <label>Student</label>
                    <Dropdown
                        placeholder="Select Student"
                        fluid
                        selection
                        options={students}
                        value={studentId}
                        onChange={(e, { value }) => setStudentId(value)}
                    />
                </Form.Field>
                <Form.Input
                    label="Amount"
                    placeholder="Enter fine amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Form.TextArea
                    label="Reason"
                    placeholder="Enter reason for fine"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <Button onClick={handleSubmit} primary fluid style={{ marginTop: '10px' }}>
                    <Icon name="paper plane" />
                    Impose Fine
                </Button>
            </Form>
            {message && <Message positive>{message}</Message>}
        </Segment>
    );
};

export default ImposeFine;
