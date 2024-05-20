import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Form, Button, Modal, Message, Dropdown } from 'semantic-ui-react';

const categoryOptions = [
    { key: 'cleaning', value: 'Cleaning Supplies', text: 'Cleaning Supplies' },
    { key: 'plumbing', value: 'Plumbing Supplies', text: 'Plumbing Supplies' },
    { key: 'safety', value: 'Safety and Security', text: 'Safety and Security' },
    { key: 'office', value: 'Office Supplies', text: 'Office Supplies' },
    { key: 'financial', value: 'Financial Management', text: 'Financial Management' },
];

const EditItemForm = ({ item, onUpdate, onCancel }) => {
    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState(item.category);
    const [quantity, setQuantity] = useState(item.quantity);
    const [message, setMessage] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hostelId=localStorage.getItem('hostelId');
        try {
            const response = await axiosPrivate.patch(`/inventory/${item._id}`, { name, category, quantity,hostel:hostelId });
            onUpdate(response.data);
            setMessage('Item updated successfully');
            window.location.reload();
        } catch (error) {
            setMessage('Error updating item');
        }
    };

    return (
        <Modal open={true} onClose={onCancel}>
            <Modal.Header>Edit Item</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <label>Item Name</label>
                        <input
                            placeholder='Item Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled
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
                            disabled
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
                    <Button type='submit'>Update Item</Button>
                    {message && <Message positive>{message}</Message>}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onCancel}>Cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default EditItemForm;
