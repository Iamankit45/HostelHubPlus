const express = require('express');
const studentRouter = express.Router();
const authMiddleware = require('../.././middlewares/authMiddleware');

const {getStudentDetails,updateAttendance,getAttendance,getAttendanceByDateAndHostel,createLeaveRequest,getLeaveRequestsForStudent,getLeaveRequestsForCaretaker,approveLeaveRequest,rejectLeaveRequest} = require('../../controllers/Student/studentController');




studentRouter.get('/',getStudentDetails);
studentRouter.post('/updateAttendance/:hostelId/:date',authMiddleware,updateAttendance);
studentRouter.get('/attendance/:hostelId/:date',authMiddleware,getAttendanceByDateAndHostel);


studentRouter.get('/get-attendance/',authMiddleware,getAttendance);

//for leave
studentRouter.post('/leave/create-leave/',authMiddleware,createLeaveRequest);
studentRouter.get('/leave/',authMiddleware,getLeaveRequestsForStudent);
studentRouter.get('/leave/:hostelId',getLeaveRequestsForCaretaker);
studentRouter.patch('/leave/:id/approve/',authMiddleware,approveLeaveRequest);
studentRouter.patch('/leave/:id/reject/',authMiddleware,rejectLeaveRequest);


module.exports = studentRouter;






