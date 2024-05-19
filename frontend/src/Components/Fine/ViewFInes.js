import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Message, Header, Icon } from 'semantic-ui-react';

const ViewFinesForCaretaker = () => {
    const privateApi = useAxiosPrivate();
    const [fines, setFines] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchFines = async () => {
            const hostelId = localStorage.getItem('hostelId');
            try {
                const response = await privateApi.get(`/fine/hostel/${hostelId}/`);
                setFines(response.data);
            } catch (error) {
                console.error('Error fetching fines for caretaker:', error);
                setMessage('Error fetching fines');
            }
        };

        fetchFines();
    }, []);

    return (
        <div className="view-fines-for-caretaker" style={{ maxWidth: '800px', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="money" />
                Fines Imposed
            </Header>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Student Name</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Reason</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fines.map(fine => (
                        <Table.Row key={fine._id}>
                            <Table.Cell>{fine.student.username}</Table.Cell>
                            <Table.Cell>{fine.amount}</Table.Cell>
                            <Table.Cell>{fine.reason}</Table.Cell>
                            <Table.Cell>{fine.status}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {message && <Message positive>{message}</Message>}
        </div>
    );
};

export default ViewFinesForCaretaker;
