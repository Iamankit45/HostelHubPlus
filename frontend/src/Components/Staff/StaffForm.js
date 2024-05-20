import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Header, Container } from 'semantic-ui-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // Import the private API hook

const positionOptions = [
    { key: 'Cleaner', value: 'Cleaner', text: 'Cleaner' },
    { key: 'Maintenance Worker', value: 'Maintenance Worker', text: 'Maintenance Worker' },
    { key: 'Security Guard', value: 'Security Guard', text: 'Security Guard' },
    { key: 'frontdesk', value: 'Front Desk Staff', text: 'Front Desk Staff' },
    { key: 'Other', value: 'Other', text: 'Other' },
];

const StaffForm = () => {
    const privateApi = useAxiosPrivate(); // Initialize the private API hook
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        position: '',
        contact: '',
        hostel: '', // Assuming you have access to the hostel ID
    });
    const [hostels, setHostels] = useState([]);
    const [usernameError, setUsernameError] = useState('');
    const [staffData, setStaffData] = useState([]);

    useEffect(() => {
        // Fetch hostels from the backend when the component mounts
        const fetchHostels = async () => {
            try {
                const response = await privateApi.get('/hostel');
                const hostelOptions = response.data.map(hostel => ({
                    key: hostel._id,
                    value: hostel._id,
                    text: hostel.name,
                }));
                setHostels(hostelOptions);
            } catch (error) {
                console.error('Error fetching hostels:', error);
            }
        };
        fetchHostels();

        // Fetch staff data from the backend when the component mounts
        const fetchStaffData = async () => {
            try {
                const response = await privateApi.get('/staff');
                setStaffData(response.data);
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };
        fetchStaffData();
    }, [privateApi]); // Fetch hostels and staff data only once when the component mounts

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
        // Reset the username error when the username field changes
        if (name === 'username') {
            setUsernameError('');
        }
    };

    const handleSubmit = async () => {
        // Validate form data
        if (!formData.name || !formData.username || !formData.position || !formData.contact || !formData.hostel) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if the entered username already exists
        if (staffData.some(staff => staff.username === formData.username)) {
            setUsernameError('Username already exists. Please choose a different username.');
            return;
        }

        try {
            // Send a POST request to the backend API to create a new staff member
            const response = await privateApi.post('/staff/create/', formData);
            // Call the onAdd function with the newly created staff member
            alert(response.data.message);
            // Reset the form fields
            setFormData({ name: '', username: '', position: '', contact: '', hostel: '' });
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('Error creating staff. Please try again.');
        }
    };

    return (
        <Container textAlign="center" style={{ marginTop: '50px' }}>
            <Header as="h2" textAlign="center" style={{ margin: '20px 0' }}>Register New Staff</Header>

            <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '15px', boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)' }}>
                <Form.Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Form.Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    error={usernameError !== ''}
                    placeholder="Enter unique username"
                />
                {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
                <Form.Field required>
                    <label>Position</label>
                    <Dropdown
                        selection
                        options={positionOptions}
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="Select Position"
                    />
                </Form.Field>
                <Form.Input
                    label="Contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />
                <Form.Field required>
                    <label>Hostel</label>
                    <Dropdown
                        selection
                        options={hostels}
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleChange}
                        placeholder="Select Hostel"
                    />
                </Form.Field>
                <Button type="submit" primary>Add Staff</Button>
            </Form>
        </Container>
    );
};

export default StaffForm;
