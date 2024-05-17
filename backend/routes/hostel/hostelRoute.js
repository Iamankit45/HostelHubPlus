const express = require('express');
const hostelRouter = express.Router();

const {createHostel,removeHostel,getHostels,getHostelDetails,allotHostel ,getStudentsByHostel,getHostelRooms,assignCaretaker,assignWarden,hostelCaretakerWarden}= require('../../controllers/hostel/hostelController');

hostelRouter.post('/add-hostel',createHostel);
hostelRouter.delete('/remove-hostel/:id',removeHostel);

hostelRouter.get('/',getHostels);
hostelRouter.get('/:id',getHostelDetails);
hostelRouter.post('/allot-hostel',allotHostel);
hostelRouter.get('/:hostelId/students',getStudentsByHostel);
hostelRouter.get('/:hostelId/rooms',getHostelRooms);
hostelRouter.post('/assign-caretaker',assignCaretaker);
hostelRouter.post('/assign-warden',assignWarden);
hostelRouter.get('/info/caretaker-Warden',hostelCaretakerWarden);

module.exports = hostelRouter;
