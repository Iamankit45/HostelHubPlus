import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button,ButtonGroup, Message, Header,ButtonOr,Segment, Icon, Modal, Form, TextArea } from 'semantic-ui-react';

const LeaveRequestsForCaretaker = () => {
    const privateApi = useAxiosPrivate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState('');
    const [caretakerRemark, setCaretakerRemark] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const role = localStorage.getItem('role');
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            const hostelId = localStorage.getItem('hostelId');
            try {
                const response = await privateApi.get(`/student/leave/${hostelId}`);
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching leave requests for caretaker:', error);
                setMessage('Error fetching leave requests');
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await privateApi.patch(`/student/leave/${id}/approve`);
            // Update leave request status in the UI
            setLeaveRequests(leaveRequests.map(request => {
                if (request._id === id) {
                    return { ...request, status: 'approved' };
                }
                return request;
            }));
            setMessage('Leave request approved successfully');
        } catch (error) {
            console.error('Error approving leave request:', error);
            setMessage('Error approving leave request');
        }
    };

    const handleReject = async () => {
        try {
            await privateApi.patch(`/student/leave/${selectedRequestId}/reject`, { caretakerRemark });
            // Update leave request status and caretaker remark in the UI
            setLeaveRequests(leaveRequests.map(request => {
                if (request._id === selectedRequestId) {
                    return { ...request, status: 'rejected', caretakerRemark };
                }
                return request;
            }));
            setMessage('Leave request rejected successfully');
            setOpenModal(false); // Close modal after submission
        } catch (error) {
            console.error('Error rejecting leave request:', error);
            setMessage('Error rejecting leave request');
        }
    };

    const openRejectModal = (id) => {
        setSelectedRequestId(id);
        setOpenModal(true);
    };

    return (
        <Segment raised style={{ width: '80%', margin: '40px auto' }}>
        
            <Header as="h2" icon textAlign="center">
                <Icon name="clipboard list" />
                Leave Requests
            </Header>
            <div className="leave-table-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
           
                <Table celled compact striped textAlign="center">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Student Name</Table.HeaderCell>
                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            <Table.HeaderCell>End Date</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Remark</Table.HeaderCell>
                            {role === 'warden' && ( <Table.HeaderCell>Actions</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {leaveRequests.map(request => (
                            <Table.Row key={request._id}>
                            
                                <Table.Cell>{request.student.username}</Table.Cell>
                                <Table.Cell>{new Date(request.startDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{new Date(request.startDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{request.status}</Table.Cell>
                                <Table.Cell>{request.caretakerRemark}</Table.Cell>
                                {role === 'warden' &&(  <Table.Cell>
                                
                                    <>
                                    {request.status === 'pending' && (
                                        <>
                                            <ButtonGroup>
                                            <Button compact size='mini' onClick={() => handleApprove(request._id)} positive>Approve</Button>
                                            <ButtonOr />
                                            <Button  compact size='mini' onClick={() => openRejectModal(request._id)} negative>Reject</Button>
                                            </ButtonGroup>
                                        </>
                                    )}</>
                                </Table.Cell>)}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            {message && <Message positive>{message}</Message>}
            <Modal open={openModal} onClose={() => setOpenModal(false)} size="mini" style={{top: '10%', maxHeight: '40vh',marginLeft:'30px', justifyContent:'center',overflowY: 'auto' }}>
                <Modal.Header>Provide Remark for Rejection</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Remark</label>
                            <TextArea
                                placeholder="Enter your remark..."
                                value={caretakerRemark}
                                onChange={(e) => setCaretakerRemark(e.target.value)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="grey" size='tiny' onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button color="red" size='tiny' onClick={handleReject}>Reject</Button>
                </Modal.Actions>
            </Modal>
       
        </Segment>
    );
};

export default LeaveRequestsForCaretaker;
