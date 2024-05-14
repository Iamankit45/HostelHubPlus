import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../api/axios';
import UserContext from '../../Context/UserContext';
import { useAuth } from '../../Context/UserContext';

const Navbar = () => {
    const { user } = useContext(UserContext);
    const { setUser } = useAuth();

    if (!user) {
        return <p>Loading...</p>; // Or handle the absence of user in another way
    }
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = async () => {
        try {
            await logout(setUser);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid ">

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/">HostelHubPlus</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item ">
                            <Link className="nav-link" to="/profile">{user ? user.username : 'Profile'}</Link>
                        </li>
                        <li className="nav-item ">
                            <span className="nav-link">{user ? user.role : 'Role'}</span>
                        </li>

                    </ul>


                    <ul className="navbar-nav  ">



                        {/* <li className="nav-item">
                            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                        </li> */}
                        {username ? (
                            <>
                                <li className="nav-item">
                                    <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a class="btn btn-primary" href="/login" role="button">Login</a>
                                    {/* <button  className="btn btn-outline-light btn-sm "><Link className="nav-link active" to="/login">LOGIN</Link></button> */}
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
