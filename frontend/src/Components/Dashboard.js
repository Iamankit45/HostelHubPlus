// In your Dashboard component
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '././Usercard';
import UserContext from '../Context/UserContext';
import useAxiosPrivate from './hooks/useAxiosPrivate';


const Dashboard = () => {
    const privateApi = useAxiosPrivate();

    const { user } = useContext(UserContext);
    

    
    if (!user) {

        return <p>Loading...</p>;
    }

    // console.log(hostelName)
    // Retrieve user information from local storage or state
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const hostelId = user.hostel || localStorage.getItem('hostelId'); // Assuming the hostel ID is stored here
    
    // Define navigation links based on the user's role
    let navigationLinks = [];
    if (role === 'student') {
        navigationLinks = [
            { label: 'View Rooms', to: '/view-rooms' },
            { label: 'Apply for Leave', to: '/apply-for-leave' },
            { label: 'View Notice Board', to: '/notice' },
            // Add more student-specific links here
        ];
    } else if (role === 'caretaker') {
        navigationLinks = [
            { label: 'Approve Leave', to: '/approve-leave' },
            { label: 'Manage Inventory', to: '/manage-inventory' },
            {label: 'Manage Notice Board', to: '/notice' },
            { label: 'Manage Rooms', to: `/view-hostels/${hostelId}` },
            {label :'Student Details', to:`/${hostelId}/student-info`},
            // Add more caretaker-specific links here
        ];
    }
    else if (role === 'warden') {
        navigationLinks = [
            { label: 'Approve Leave', to: '/approve-leave' },
            { label: 'Manage Inventory', to: '/manage-inventory' },
            {label: 'Manage Notice Board', to: '/notice' },
            { label: 'Manage Rooms', to: `/view-hostels/${hostelId}` },
            {label :'Student Details', to:`/${hostelId}/student-info`},
            // Add more caretaker-specific links here
        ];
    }
    else if(role=='hosteladmin') 
        {
            navigationLinks = [
                
                
                {label: 'Manage Notice Board', to: '/notice' },
                { label: 'Hostel Details', to: '/admin/view-hostels' },
                {label:'Hostel Allotment',to: '/admin/hostel-allotment'},
                {label:'Manage Caretaker',to: '/hostel/assign-caretaker'},
                {label:'Manage Warden',to: '/hostel/assign-warden'},
                {label:'Add Hostel',to: '/admin/add-hostel'},

                


                // Add more caretaker-specific links here
            ];

    }
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <UserCard username={user.username} role={user.role} hostel={hostelId}/>
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
