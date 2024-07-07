// In your Dashboard component
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserCard from '././Usercard';
import UserContext from '../Context/UserContext';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { List, Message, Menu, Dropdown, Icon, Segment, Header } from 'semantic-ui-react';
import StudentDashboard from './Student/StudentDashboard'; // Import the StudentDashboard component
import DashNoticeBoard from './Notice/DashNotice';
import "./dashboard.css"

const Dashboard = () => {
    const privateApi = useAxiosPrivate();

    const { user } = useContext(UserContext);
    const [hostels, setHostels] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [showHostelSelect, setShowHostelSelect] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        // Fetch the list of hostels from the API
        privateApi.get('/hostel')
            .then(response => {
                setHostels(response.data);
            })
            .catch(error => {
                console.error('Error fetching hostels:', error);
            });
        // Fetch notifications for the user
        privateApi.get('/notifications')
            .then(response => {
                console.log(response);
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
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
    const handleHostelSelect = (e, { value }) => {
        setSelectedHostel(value);




        // Redirect to student info page with selected hostel ID
        navigate(`/${value}/student-info`);
    };


    const handleNotificationClick = (notificationId) => {
        // Mark the notification as read
        privateApi.patch(`/notifications/${notificationId}/read`)
            .then(response => {
                // Update the notification list with the updated notification
                setNotifications(notifications.map(notification =>
                    notification._id === notificationId ? response.data : notification
                ));
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
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
            { label: 'View Rooms', to: `/view-hostels/${hostelId}` },

            { label: 'View Notice Board', to: '/notice' },
            { label: 'Complaints', to: '/student/register-complaint' },
            { label: 'Apply for Leave', to: '/student/create-leave' },
            { label: 'Leave Status', to: '/student/leave-status' },
            { label: 'Fines', to: '/student/fines' },
            {label:'Request for Room Change' ,to :'/request-room-change/'}
            // Add more student-specific links here
        ];
    } else if (role === 'caretaker') {
        navigationLinks = [

            { label: 'Manage Rooms', to: `/view-hostels/${hostelId}` },
            { label: 'Student Leave', to: '/caretaker/leave' },
            // { label: 'Manage Inventory', to: '/manage-inventory' },
            { label: 'Manage Notice Board', to: '/notice' },

            { label: 'Student Details', to: `/${hostelId}/student-info` },
            { label: 'Student Attendance', to: `/student/mark-attendance` },
            { label: 'Complaints', to: `/caretaker/complaints` },

            {
                label: 'Manage Fines',
                dropdown: [
                    { label: 'Impose', to: '/caretaker/impose-fine' },
                    { label: 'View', to: '/caretaker/view-fines' },
                ]
            },
            {
                label: 'Manage Inventory',
                dropdown: [
                    { label: 'Add', to: '/addInventory/' },
                    { label: 'View', to: '/inventory/' },
                ]
            },
            {
                label: 'Manage Staff',
                dropdown: [
                    { label: 'New staff', to: '/add-staff/' },
                    { label: 'Schedule', to: '/staff-schedule' },
                ]

            }


            // Add more caretaker-specific links here
        ];
    }
    else if (role === 'warden') {
        navigationLinks = [
            { label: 'Student Details', to: `/${hostelId}/student-info` },
            { label: 'Manage Leave', to: '/caretaker/leave' },
            { label: 'View Rooms', to: `/view-hostels/${hostelId}` },
            { label: 'View Inventory', to: '/inventory/' },
            { label: 'Manage Notice Board', to: '/notice' },
            { label: 'View Complaints', to: `/caretaker/complaints` },
            { label: 'View fines', to: '/caretaker/view-fines' },



        ];
    }
    else if (role == 'hosteladmin') {
        navigationLinks = [


            { label: 'Manage Notice Board', to: '/notice' },
            { label: 'Hostel Details', to: '/admin/view-hostels' },
            { label: 'Hostel Allotment', to: '/admin/hostel-allotment' },
            { label: 'Add Hostel', to: '/admin/add-hostel' },
            { label: 'Manage Caretaker', to: '/hostel/assign-caretaker' },
            { label: 'Manage Warden', to: '/hostel/assign-warden' },

            { label: 'Student Details', onClick: handleStudentDetailsClick },
            {label:'Register Student' ,to: '/register-student'},

            // Add more caretaker-specific links here
        ];

    }
    // Sort notifications by creation date in descending order
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="ui container mt-5">
            <div className="ui stackable grid">
                <div className="four wide column">
                    <UserCard username={user.username} role={user.role} hostel={hostelId} profile={user.profile} />
                    <Menu vertical fluid>
                        {navigationLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                {link.dropdown ? (
                                    <Dropdown item text={link.label}>
                                        <Dropdown.Menu >
                                            {link.dropdown.map((sublink, subIndex) => (
                                                <Dropdown.Item key={subIndex} as={Link} to={sublink.to}>
                                                    {sublink.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ) : link.to ? (
                                    <Menu.Item as={Link} to={link.to}>{link.label}</Menu.Item>
                                ) : (
                                    <Menu.Item as="a" onClick={link.onClick}>{link.label}</Menu.Item>
                                )}
                            </React.Fragment>
                        ))}
                        {showHostelSelect && (
                            <Dropdown
                                placeholder='Select Hostel'
                                fluid
                                selection
                                options={hostels.map(hostel => ({
                                    key: hostel.id,
                                    text: hostel.name,
                                    value: hostel._id,
                                }))}
                                onChange={handleHostelSelect}
                            />
                        )}
                    </Menu>
                </div>

                <div className="eight wide column">
                    {role === 'student' && (
                        <StudentDashboard />
                    )}
                    {
                        (role === 'caretaker' || role === 'warden' || role === 'hosteladmin') && (
                            <DashNoticeBoard/>
                        )
                    }
                    

                </div>
                <div className="four wide column centered">
                    <h2>Notifications</h2>
                    <div className="notifications-list">
                        {sortedNotifications.length === 0 ? (
                            <Message info>
                                <Message.Header>No Notifications</Message.Header>
                                <p>You have no new notifications.</p>
                            </Message>
                        ) : (
                            <List divided relaxed>
                                {sortedNotifications.map(notification => (
                                    <List.Item
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification._id)}
                                        className={notification.isRead ? 'read-notification' : 'unread-notification'}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Icon name={notification.isRead ? 'envelope open outline' : 'envelope outline'} />
                                        <List.Content>
                                            <List.Header as='a'>{notification.message}</List.Header>
                                            <List.Description as='a'>{new Date(notification.createdAt).toLocaleString()}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                ))}
                            </List>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Dashboard;
