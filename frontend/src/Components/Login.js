import React, { useState, useContext } from 'react';
import { login } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Context/UserContext'; // Import UserContext



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
            const { username, token, role } = await login(formData);

            setUser({ username, token, role });

            // Store user information in local storage or state
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            
           
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">Login</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                                {error && <div className="text-danger mt-3">{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
