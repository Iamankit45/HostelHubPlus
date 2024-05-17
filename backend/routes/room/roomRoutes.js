const express = require('express');
const roomRouter = express.Router();
const authMiddleware = require('../.././middlewares/authMiddleware');

const {allotRoomsToStudents,removeRoomAllotments,reassignStudentRoom,swapStudentRooms} = require('../../controllers/Room/roomController');


roomRouter.post('/allot-rooms/:hostelId',authMiddleware, allotRoomsToStudents);
roomRouter.delete('/remove-allotment/:hostelId',removeRoomAllotments);
roomRouter.post('/reassign-room',authMiddleware,reassignStudentRoom);
roomRouter.post('/swap-rooms',authMiddleware,swapStudentRooms);



module.exports=roomRouter;

