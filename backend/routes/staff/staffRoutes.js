const express =require('express');

const staffRouter=express.Router();


const authMiddleware = require('../.././middlewares/authMiddleware');
const {createStaff,getAllStaff,getStaffById,updateStaffById,deleteStaffById,createOrUpdateStaffSchedule ,getStaffSchedule ,getStaffScheduleById,updateStaffScheduleById,deleteStaffScheduleById,hostelCleanerStaff  } = require('../../controllers/staff/staffController');


//staff
staffRouter.post('/create', createStaff);
staffRouter.get('/', getAllStaff);
staffRouter.get('/hostel-cleaner/:hostelId',hostelCleanerStaff )
// staffRouter.get('/:id', getStaffById);
// staffRouter.put('/:id', updateStaffById);
// staffRouter.delete('/:id', deleteStaffById);

//staffschedule

staffRouter.post('/schedule/create', createOrUpdateStaffSchedule );
staffRouter.get('/schedule/', getStaffSchedule);
staffRouter.get('/schedule/:id', getStaffScheduleById);
staffRouter.put('/schedule/:id', updateStaffScheduleById);
staffRouter.delete('/schedule/:id', deleteStaffScheduleById);

module.exports=staffRouter;
// Get all notices