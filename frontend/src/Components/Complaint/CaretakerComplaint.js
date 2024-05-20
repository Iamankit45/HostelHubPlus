// CaretakerComplaints.js

import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button, Message, Header, Segment, Icon, Modal, Form, TextArea } from 'semantic-ui-react';

const CaretakerComplaints = () => {
    const privateApi = useAxiosPrivate();
    const [complaints, setComplaints] = useState([]);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [remark, setRemark] = useState('');
    const role=localStorage.getItem('role');

    useEffect(() => {
        const hostelId = localStorage.getItem('hostelId');
        privateApi.get(`/complaint/hostel/${hostelId}`)
            .then(response => {
                // Sort complaints by newest first
                const sortedComplaints = response.data.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComplaints(sortedComplaints);
            })
            .catch(error => {
                console.error('Error fetching complaints:', error);
            });
    }, [privateApi]);

    const handleOpen = (complaint) => {
        setSelectedComplaint(complaint);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedComplaint(null);
        setRemark('');
    };

    const handleResolveComplaint = () => {
        if (selectedComplaint) {
            privateApi.post(`/complaint/resolveComplaint/${selectedComplaint._id}`, { remark })
                .then(response => {
                    setMessage(response.data.message);
                    setComplaints(complaints.map(complaint =>
                        complaint._id === selectedComplaint._id ? { ...complaint, status: 'resolved', remark } : complaint
                    ));
                    handleClose();
                    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
                })
                .catch(error => {
                    console.error('Error resolving complaint:', error);
                });
        }
    };

    return (
        <Segment raised style={{ width: '80%', margin: '20px auto' }}>
            <Header as="h2" icon textAlign="center">
                <Icon name="clipboard list" />
                Complaints
            </Header>
            {message && <Message positive>{message}</Message>}
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Student Name</Table.HeaderCell>
                            <Table.HeaderCell>Complaint</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Remark</Table.HeaderCell>
                            {role === 'caretaker' && (   <Table.HeaderCell>Actions</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {complaints.map(complaint => (
                            <Table.Row key={complaint._id}>
                                <Table.Cell>{complaint.student.username}</Table.Cell>
                                <Table.Cell>{complaint.complaint}</Table.Cell>
                                <Table.Cell>{complaint.status}</Table.Cell>
                                <Table.Cell>{complaint.remark}</Table.Cell>
                                {role === 'caretaker' && (    <Table.Cell>
                                    {complaint.status === 'pending' && (
                                        <Button onClick={() => handleOpen(complaint)} primary>Resolve</Button>
                                    )}
                                </Table.Cell>)}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Modal open={open} onClose={handleClose} size="small" closeIcon centered style={{top: '10%', maxHeight: '40vh',marginLeft:'30px', justifyContent:'center',overflowY: 'auto' }}>
                <Modal.Header>Resolve Complaint</Modal.Header>
                <Modal.Content >
                    <Form>
                        <Form.Field>
                            <label>Remark</label>
                            <TextArea
                                placeholder='Add a remark'
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button primary onClick={handleResolveComplaint}>Resolve</Button>
                </Modal.Actions>
            </Modal>
        </Segment>
    );
};

export default CaretakerComplaints;
