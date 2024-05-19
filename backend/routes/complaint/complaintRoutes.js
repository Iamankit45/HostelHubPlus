const express=require('express');

const complaintRouter = express.Router();
const authMiddleware = require('../.././middlewares/authMiddleware');


const {registerComplaint,getComplaints ,resolveComplaint,studentComplaint}=require('../../controllers/complaint/complaintController.js');

complaintRouter.post('/:hostelId',authMiddleware,registerComplaint);

complaintRouter.get('/hostel/:hostelId',authMiddleware,getComplaints);

complaintRouter.post('/resolveComplaint/:complaintId',authMiddleware,resolveComplaint);
complaintRouter.get('/student',authMiddleware,studentComplaint);

module.exports=complaintRouter;