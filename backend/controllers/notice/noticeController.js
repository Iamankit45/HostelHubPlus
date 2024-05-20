
const Notice = require('../../models/notice/notice.js');
const User = require('../../models/user/user');
// Get all notices
const getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new notice
const createNotice = async (req, res) => {
    // Extract user ID from decoded JWT token
    const { userId } = req.user;

    try {
        // Fetch user details from the database based on user ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new notice with user details
        const notice = new Notice({
            title: req.body.title,
            description: req.body.description,
            postedBy: {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            hostel: req.body.hostel,
            date: req.body.date
        });

        // Save the notice to the database
        await notice.save();

        res.status(201).json({ message: 'Notice created successfully', notice });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};


// Get a single notice by ID
const getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (notice) {
            res.json(notice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a notice by ID
const updateNoticeById = async (req, res) => {
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedNotice) {
            res.json(updatedNotice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a notice by ID
const deleteNoticeById = async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (deletedNotice) {
            res.json({ message: 'Notice deleted' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllNotices,
    createNotice,
    getNoticeById,
    updateNoticeById,
    deleteNoticeById
};
