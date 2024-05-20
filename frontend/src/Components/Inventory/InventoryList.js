import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Table, Button, Message, Header, Dropdown, Icon, Grid } from 'semantic-ui-react';
import EditItemForm from './EditItemForm';
import './inventory.css'; // Import CSS file for custom styling

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const role = localStorage.getItem('role');

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

    const handleCategoryChange = (e, { value }) => {
        setSelectedCategory(value);
    };

    // Filter items based on selected category
    const filteredItems = selectedCategory ? items.filter(item => item.category === selectedCategory) : items;

    // Helper function to get category options
    const getCategoryOptions = () => {
        // Assuming categories are extracted from existing items
        const categories = [...new Set(items.map(item => item.category))];
        return categories.map(category => ({
            key: category,
            value: category,
            text: category,
        }));
    };

    return (
        <div className="inventory-list-container">
            {message && <Message>{message}</Message>}
            <Grid stackable>
                <Grid.Row columns={2}>
                    
                        <Dropdown
                            placeholder='Select Category'
                            fluid
                            selection
                            options={getCategoryOptions()}
                            onChange={handleCategoryChange}
                            value={selectedCategory}
                        />
                    
                    
                </Grid.Row>
            </Grid>
            <div className="inventory-list">
                <Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Threshold</Table.HeaderCell>
                            {role === 'caretaker' && (  <Table.HeaderCell>Actions</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredItems.map(item => (
                            <Table.Row
                                key={item._id}
                                className={item.quantity < item.threshold ? 'red-mark' : ''}
                            >
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.category}</Table.Cell>
                                <Table.Cell>{item.quantity}</Table.Cell>
                                <Table.Cell>{item.threshold}</Table.Cell>
                                {role === 'caretaker' && ( <Table.Cell>
                                   
                                        <>
                                            <Button onClick={() => handleEdit(item)}>Edit</Button>
                                            <Button onClick={() => handleDelete(item._id)} negative>Delete</Button>
                                        </>
                                    
                                </Table.Cell>)}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            {editItem && (
                <EditItemForm item={editItem} onUpdate={handleUpdate} onCancel={() => setEditItem(null)} />
            )}
        </div>
    );
};

export default InventoryList;
