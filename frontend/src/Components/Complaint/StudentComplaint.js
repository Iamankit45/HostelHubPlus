import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Form, TextArea, Button, Message, Segment, Header, Icon, Table } from 'semantic-ui-react';

const StudentComplaint = () => {
    const privateApi = useAxiosPrivate();
    const [complaint, setComplaint] = useState('');
    const [message, setMessage] = useState('');
    const [studentComplaints, setStudentComplaints] = useState([]);

    useEffect(() => {
        // Fetch student's complaints on component mount
        fetchStudentComplaints();
    }, []);

    const fetchStudentComplaints = () => {
        privateApi.get(`/complaint/student`)
            .then(response => {
                setStudentComplaints(response.data.complaints);
            })
            .catch(error => {
                console.error('Error fetching student complaints:', error);
            });
    };

    const handleComplaintChange = (e) => {
        setComplaint(e.target.value);
    };

    const handleSubmit = () => {
        const hostelId = localStorage.getItem('hostelId');
        privateApi.post(`/complaint/${hostelId}`, { complaint })
            .then(() => {
                setMessage('Complaint submitted successfully');
                setComplaint('');
                fetchStudentComplaints(); // Fetch updated complaints after submission
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            })
            .catch(error => {
                console.error('Error submitting complaint:', error);
                setMessage('Error submitting complaint');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            });
    };

    return (
        <Segment raised style={{ width: '80%', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="pencil alternate" />
                Register a Complaint
            </Header>
            <Form>
                <TextArea
                    placeholder="Describe your complaint"
                    value={complaint}
                    onChange={handleComplaintChange}
                    style={{ minHeight: 150 }}
                />
                <Button onClick={handleSubmit} primary fluid style={{ marginTop: '10px' }}>
                    <Icon name="paper plane" />
                    Submit Complaint
                </Button>
            </Form>
            {message && <Message positive>{message}</Message>}
            <Header as="h3" icon textAlign="center" style={{ marginTop: '30px' }}>
                <Icon name="list alternate" />
                Your Complaints
            </Header>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <Table celled >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Complaint</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Remark</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {studentComplaints.map(studentComplaint => (
                        <Table.Row key={studentComplaint.id}>
                            <Table.Cell>{studentComplaint.complaint}</Table.Cell>
                            <Table.Cell>{studentComplaint.status}</Table.Cell>
                            <Table.Cell>{studentComplaint.remark}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        </Segment>
    );
};

export default StudentComplaint;
