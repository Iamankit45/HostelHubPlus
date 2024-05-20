// controllers/inventoryController.js

const Inventory = require('../../models/Inventory/inventory.js');
const Caretaker = require('../../models/caretaker/caretaker.js');
const Warden = require('../../models/warden/warden.js');
const Notification = require('../../models/notification/notification.js');
const User = require('../../models/user/user');
const Hostel = require('../../models/Hostel/hostel.js');

// Function to add a new inventory item
exports.addItem = async (req, res) => {
    const caretaker = req.user.userId;
    console.log(caretaker);
    try {
        const { name, category, quantity, threshold, hostel } = req.body;
        

        const newItem = new Inventory({
            name,
            category,
            quantity,
            threshold,
            caretaker,
            hostel,
        });
        
        await newItem.save();
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to get all inventory items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to update an inventory item
exports.updateItem = async (req, res) => {
    try {
        const { name, category, quantity, hostel } = req.body;
        const itemId = req.params.itemId;
        
        // console.log(req.body);
        const item = await Inventory.find({_id: itemId});
        const threshold=item.threshold;
        

        const updatedItem = await Inventory.findByIdAndUpdate(
            itemId,
            { name, category, quantity, threshold, hostel },
            { new: true }
        );

        
        const Hname=await Hostel.findOne({_id:hostel});
        
        const hname=Hname.name
        // Check if quantity is below threshold
        if (updatedItem.quantity < updatedItem.threshold) {
            const warden = await Warden.findOne({hostel: updatedItem.hostel }); // Assuming there is a user role 'warden' and they are associated with a hostel
            
            if (warden) {
                const notification = new Notification({
                    sender: req.user.userId,
                    recipient: warden._id,
                    message: `Inventory for ${updatedItem.name} has fallen below the threshold in hostel ${hname}`,
                });
                await notification.save();
            }
        }

        res.status(200).json({message: 'Invenotry added succesfully'});
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to delete an inventory item
exports.deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await Inventory.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
