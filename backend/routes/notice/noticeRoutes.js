const express = require('express');
const noticeRouter = express.Router();
const noticeController = require('../../controllers/notice/noticeController');
const authMiddleware = require('../.././middlewares/authMiddleware');
const { createNotice,getAllNotices,getNoticeById ,updateNoticeById,deleteNoticeById} = require('../../controllers/notice/noticeController');
// Get all notices
noticeRouter.get('/',getAllNotices);

// Create a new notice
noticeRouter.post('/',authMiddleware,createNotice);

// Get a single notice by ID
noticeRouter.get('/:id',getNoticeById);

// Update a notice by ID
noticeRouter.put('/:id',updateNoticeById);

// Delete a notice by ID
noticeRouter.delete('/:id',deleteNoticeById);

module.exports = noticeRouter;
