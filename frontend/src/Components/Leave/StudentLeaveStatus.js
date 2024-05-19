import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Message, Header, Icon } from 'semantic-ui-react';

const StudentLeaveStatus = () => {
    const privateApi = useAxiosPrivate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await privateApi.get('/student/leave/');
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching leave requests for student:', error);
                setMessage('Error fetching leave requests');
            }
        };

        fetchLeaveRequests();
    }, []);

    return (
        <div className="student-leave-status" style={{ maxWidth: '800px', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="calendar check outline" />
                My Leave Requests
            </Header>
            <div className="leave-table-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>

                <Table celled>
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            <Table.HeaderCell>End Date</Table.HeaderCell>
                            <Table.HeaderCell>Reason</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Remark</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {leaveRequests.map(request => (
                            <Table.Row key={request._id}>
                                <Table.Cell>{new Date(request.startDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{new Date(request.endDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{request.reason}</Table.Cell>

                                <Table.Cell>{request.status}</Table.Cell>
                                <Table.Cell>{request.caretakerRemark}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {message && <Message negative>{message}</Message>}
            </div>
        </div>
    );
};

export default StudentLeaveStatus;
