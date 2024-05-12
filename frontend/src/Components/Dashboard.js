// In your Dashboard component
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '././Usercard';
import UserContext from '../Context/UserContext';


const Dashboard = () => {

    const { user } = useContext(UserContext);


    if (!user) {

        return <p>Loading...</p>;
    }


    // Retrieve user information from local storage or state
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Define navigation links based on the user's role
    let navigationLinks = [];
    if (role === 'student') {
        navigationLinks = [
            { label: 'View Rooms', to: '/view-rooms' },
            { label: 'Apply for Leave', to: '/apply-for-leave' },
            { label: 'View Notice Board', to: '/view-notice-board' },
            // Add more student-specific links here
        ];
    } else if (role === 'staff') {
        navigationLinks = [
            { label: 'Approve Leave', to: '/approve-leave' },
            { label: 'Manage Inventory', to: '/manage-inventory' },
            // Add more staff-specific links here
        ];
    }
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <UserCard username={user.username} role={user.role} />
                    <div className="list-group mt-3">
                        {navigationLinks.map((link, index) => (
                            <Link key={index} to={link.to} className="list-group-item list-group-item-action">{link.label}</Link>
                        ))}
                    </div>
                </div>
                <div className="col-md-9">
                    {/* Main content area */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
