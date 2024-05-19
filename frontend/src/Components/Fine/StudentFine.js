import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button, Message, Header, Icon } from 'semantic-ui-react';

const StudentFines = () => {
    const privateApi = useAxiosPrivate();
    const [fines, setFines] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await privateApi.get('/fine/student');
                setFines(response.data);
            } catch (error) {
                console.error('Error fetching fines for student:', error);
                setMessage('Error fetching fines');
            }
        };

        fetchFines();
    }, []);

    const handlePayFine = async (id) => {
        try {
            await privateApi.patch(`/fine/pay/${id}`);
            setFines(fines.map(fine => {
                if (fine._id === id) {
                    return { ...fine, status: 'paid' };
                }
                return fine;
            }));
            setMessage('Fine paid successfully');
        } catch (error) {
            console.error('Error paying fine:', error);
            setMessage('Error paying fine');
        }
    };

    return (
        <div className="student-fines" style={{ maxWidth: '800px', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="money bill alternate outline" />
                My Fines
            </Header>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Reason</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fines.map(fine => (
                        <Table.Row key={fine._id}>
                            <Table.Cell>{fine.amount}</Table.Cell>
                            <Table.Cell>{fine.reason}</Table.Cell>
                            <Table.Cell>{fine.status}</Table.Cell>
                            <Table.Cell>
                                {fine.status === 'pending' && (
                                    <Button onClick={() => handlePayFine(fine._id)} positive>Pay</Button>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {message && <Message positive>{message}</Message>}
        </div>
    );
};

export default StudentFines;
