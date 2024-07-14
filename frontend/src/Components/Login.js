import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

import { login } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Context/UserContext'; // Import UserContext
import './Login.css';


const Login = ({ history }) => {
     const navigate = useNavigate();
     const { setUser } = useContext(UserContext);
   
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { username, token, role,hostelId } = await login(formData);
            
            console.log(hostelId);
            setUser({ username, token, role,hostelId  });

            // Store user information in local storage or state
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if (hostelId) {
                
                localStorage.setItem('hostelId', hostelId);  // Save the hostel ID
            }

            
           
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    
    return (
        <div className="login-background">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100">
                    <Col md={8} lg={6} className="mx-auto">
                        <Card className="p-4">
                            <Card.Body>
                                <h3 className="text-center mb-4">Log-in to your account</h3>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formUsername" className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100">
                                        Login
                                    </Button>
                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
