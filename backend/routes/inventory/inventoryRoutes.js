const express = require('express');
const inventoryRouter = express.Router();



const authMiddleware = require('../.././middlewares/authMiddleware');
const { addItem,getAllItems,updateItem,deleteItem} = require('../../controllers/inventory/inventoryController');




// Route to add a new inventory item
inventoryRouter.post('/caretaker/add',authMiddleware, addItem);

// Route to get all inventory items
inventoryRouter.get('/', authMiddleware,getAllItems);

// Route to update an inventory item
inventoryRouter.patch('/:itemId',authMiddleware, updateItem);

// Route to delete an inventory item
inventoryRouter.delete('/:itemId',authMiddleware, deleteItem);

module.exports = inventoryRouter;