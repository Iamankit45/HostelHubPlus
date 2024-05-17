// routes/notifications.js

const express = require('express');
const notificationRouter = express.Router();
const authMiddleware = require('.././middlewares/authMiddleware.js'); 
const Notification = require('../models/notification/notification.js'); 


// GET route to fetch notifications for the logged-in student
notificationRouter.get('/', authMiddleware, async (req, res) => {
    try {
        // console.log(req.user);
        // Fetch notifications from the database based on the user's ID
        const notifications = await Notification.find({ recipient: req.user.userId });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Mark notification as read
notificationRouter.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error });
    }
});


module.exports = notificationRouter;
