import React, { useState } from 'react';
import { Form, Button, Container, Segment, Header, TextArea } from 'semantic-ui-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const RequestRoomChange = () => {
    const axiosPrivate = useAxiosPrivate();
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const hostelId = localStorage.getItem('hostelId'); // Assuming hostelId is stored in localStorage

            const response = await axiosPrivate.post('/student/request-room-change', {
                message,
                hostelId
            });

            setSuccess(response.data.message);
            setError(null);
            setMessage('');
        } catch (error) {
            setSuccess(null);
            setError(error.response?.data?.message || 'Error sending room change request');
        }
    };

    return (
        <Container text style={{marginTop: '50px', padding: '0px', borderRadius: '15px', boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)' }}>
            <Segment>
                <Header as="h2" textAlign="center">Request Room Change</Header>

                
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <label>Message</label>
                            <TextArea
                                placeholder="Do you want to swap room or change room? Give room number and username with whom you want to change."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </Form.Field>
                        <Button type="submit" primary fluid>Send Request</Button>
                    </Form>
                    {success && <Segment color="green">{success}</Segment>}
                    {error && <Segment color="red">{error}</Segment>}
               
            </Segment>
        </Container>
    );
};

export default RequestRoomChange;
