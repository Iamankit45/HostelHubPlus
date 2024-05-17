// In your Dashboard component
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserCard from '././Usercard';
import UserContext from '../Context/UserContext';
import useAxiosPrivate from './hooks/useAxiosPrivate';


const Dashboard = () => {
    const privateApi = useAxiosPrivate();

    const { user } = useContext(UserContext);
    const [hostels, setHostels] = useState([]);
    const navigate = useNavigate();
    const [showHostelSelect, setShowHostelSelect] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState('');
    
    useEffect(() => {
        // Fetch the list of hostels from the API
    privateApi.get('/hostel')
            .then(response => {
                setHostels(response.data);
            })
            .catch(error => {
                console.error('Error fetching hostels:', error);
            });
    }, []);

    if (!user) {

        return <p>Loading...</p>;
    }
    // Handle click on "Student Details" link
    const handleStudentDetailsClick = () => {
        setShowHostelSelect(true);
    };

    // Handle hostel selection from dropdown
    const handleHostelSelect = (e) => {
        const selectedHostelId = e.target.value;
        setSelectedHostel(selectedHostelId);
        // Redirect to student info page with selected hostel ID
        navigate(`/${selectedHostelId}/student-info`);
    };

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
            { label: 'Manage Notice Board', to: '/notice' },
            { label: 'Manage Rooms', to: `/view-hostels/${hostelId}` },
            { label: 'Student Details', to: `/${hostelId}/student-info` },
            // Add more caretaker-specific links here
        ];
    }
    else if (role === 'warden') {
        navigationLinks = [
            { label: 'Approve Leave', to: '/approve-leave' },
            { label: 'Manage Inventory', to: '/manage-inventory' },
            { label: 'Manage Notice Board', to: '/notice' },
            { label: 'Manage Rooms', to: `/view-hostels/${hostelId}` },
            { label: 'Student Details', to: `/${hostelId}/student-info` },
            
        ];
    }
    else if (role == 'hosteladmin') {
        navigationLinks = [


            { label: 'Manage Notice Board', to: '/notice' },
            { label: 'Hostel Details', to: '/admin/view-hostels' },
            { label: 'Hostel Allotment', to: '/admin/hostel-allotment' },
            { label: 'Manage Caretaker', to: '/hostel/assign-caretaker' },
            { label: 'Manage Warden', to: '/hostel/assign-warden' },
            { label: 'Add Hostel', to: '/admin/add-hostel' },
            { label: 'Student Details', onClick: handleStudentDetailsClick},
            



            // Add more caretaker-specific links here
        ];

    }
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <UserCard username={user.username} role={user.role} hostel={hostelId} />
                    <div className="list-group mt-3">
                    {navigationLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                {link.to ? (
                                    <Link to={link.to} className="list-group-item list-group-item-action">{link.label}</Link>
                                ) : (
                                    <button className="list-group-item list-group-item-action" onClick={link.onClick}>{link.label}</button>
                                )}
                            </React.Fragment>
                        ))}
                        {showHostelSelect && (
                            <select className="form-select form-select-sm mt-2 " onChange={handleHostelSelect}>
                                <option  value="">Select Hostel</option>
                                
                                {hostels.map(hostel => (
                                    <option key={hostel.id} value={hostel._id} className="list-group-item list-group-item-action">{hostel.name}</option>
                                ))}
                                
                            </select>
                        )}
                    </div>
                </div>
                <div className="col-md-9">
                    
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
