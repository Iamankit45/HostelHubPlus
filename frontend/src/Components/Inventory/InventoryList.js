import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button, Message } from 'semantic-ui-react';
import EditItemForm from './EditItemForm';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosPrivate.get('/inventory');
                setItems(response.data);
            } catch (error) {
                setMessage('Error fetching items');
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosPrivate.delete(`/inventory/${id}`);
            setItems(items.filter(item => item._id !== id));
            setMessage('Item deleted successfully');
        } catch (error) {
            setMessage('Error deleting item');
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
    };

    const handleUpdate = (updatedItem) => {
        setItems(items.map(item => (item._id === updatedItem._id ? updatedItem : item)));
        setEditItem(null);
    };

    return (
        <div>
            {message && <Message>{message}</Message>}
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map(item => (
                        <Table.Row key={item._id}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.category}</Table.Cell>
                            <Table.Cell>{item.quantity}</Table.Cell>
                            <Table.Cell>
                                <Button onClick={() => handleEdit(item)}>Edit</Button>
                                <Button onClick={() => handleDelete(item._id)} negative>Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {editItem && (
                <EditItemForm item={editItem} onUpdate={handleUpdate} onCancel={() => setEditItem(null)} />
            )}
        </div>
    );
};

export default InventoryList;
