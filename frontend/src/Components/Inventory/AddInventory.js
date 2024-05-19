import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Form, Button, Message, Dropdown } from 'semantic-ui-react';

const categoryOptions = [
    { key: 'cleaning', value: 'Cleaning Supplies', text: 'Cleaning Supplies' },
    { key: 'plumbing', value: 'Plumbing Supplies', text: 'Plumbing Supplies' },
    { key: 'safety', value: 'Safety and Security', text: 'Safety and Security' },
    { key: 'office', value: 'Office Supplies', text: 'Office Supplies' },
    { key: 'financial', value: 'Financial Management', text: 'Financial Management' },
];

const AddItemForm = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [threshold, setThreshold] = useState('');
    const [hostel, setHostel] = useState('');
    const [hostels, setHostels] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const privateApi = useAxiosPrivate();

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const response = await privateApi.get('/hostel'); // Assuming an endpoint to get hostels
                setHostels(response.data);
            } catch (error) {
                console.error('Error fetching hostels:', error);
            }
        };
        fetchHostels();
    }, [privateApi]);

    const hostelOptions = hostels.map((hostel) => ({
        key: hostel._id,
        value: hostel._id,
        text: hostel.name,
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset success message
        setError(''); // Reset error message
        try {
            const response = await privateApi.post('/inventory/caretaker/add', { name, category, quantity, threshold, hostel });
            if (response.status === 201) {
                console.log(response)
                setMessage('Item added successfully');
                
                setName('');
                setCategory('');
                setQuantity('');
                setThreshold('');
                setHostel('');
            } else {
                setError('Error adding item');
            }
        } catch (error) {
            console.log(error);
            setError('Error adding item');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Item Name</label>
                <input
                    placeholder='Item Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <label>Category</label>
                <Dropdown
                    placeholder='Select Category'
                    fluid
                    selection
                    options={categoryOptions}
                    value={category}
                    onChange={(e, { value }) => setCategory(value)}
                />
            </Form.Field>
            <Form.Field>
                <label>Quantity</label>
                <input
                    type='number'
                    placeholder='Quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <label>Threshold</label>
                <input
                    type='number'
                    placeholder='Threshold'
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <label>Hostel</label>
                <Dropdown
                    placeholder='Select Hostel'
                    fluid
                    selection
                    options={hostelOptions}
                    value={hostel}
                    onChange={(e, { value }) => setHostel(value)}
                />
            </Form.Field>
            <Button type='submit'>Add Item</Button>
            {message && <Message positive>{message}</Message>}
            {error && <Message negative>{error}</Message>}
        </Form>
    );
};

export default AddItemForm;
