const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    caretaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caretaker',
        required: true,
    },
    
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
