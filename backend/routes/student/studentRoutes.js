const express = require('express');
const studentRouter = express.Router();
const authMiddleware = require('../.././middlewares/authMiddleware');

const {getStudentDetails,updateAttendance,getAttendance,getAttendanceByDateAndHostel} = require('../../controllers/Student/studentController');




studentRouter.get('/',getStudentDetails);
studentRouter.post('/updateAttendance/:hostelId/:date',authMiddleware,updateAttendance);
studentRouter.get('/attendance/:hostelId/:date',authMiddleware,getAttendanceByDateAndHostel);


studentRouter.get('/get-attendance/',authMiddleware,getAttendance);


module.exports = studentRouter;






