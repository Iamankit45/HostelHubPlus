const express = require('express');
const hostelRouter = express.Router();

const {createHostel,removeHostel,getHostels,getHostelDetails,allotHostel ,getStudentsByHostel}= require('../../controllers/hostel/hostelController');

hostelRouter.post('/add-hostel',createHostel);
hostelRouter.delete('/remove-hostel/:id',removeHostel);

hostelRouter.get('/',getHostels);
hostelRouter.get('/:id',getHostelDetails);
hostelRouter.post('/allot-hostel',allotHostel);
hostelRouter.get('/:hostelId/students',getStudentsByHostel);

module.exports = hostelRouter;
