// routes/userRoutes.js

const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/User/userController');

// Create a new user
userRouter.post('/create-user', userController.createUser);

// Get all users
userRouter.get('/get-users', userController.getAllUsers);

// Get user by ID
userRouter.get('/:userId', userController.getUserById);

// Update user by ID
userRouter.put('/:userId', userController.updateUserById);

// Delete user by ID
userRouter.delete('/:userId', userController.deleteUserById);

module.exports = userRouter;
