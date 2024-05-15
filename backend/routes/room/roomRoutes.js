const express = require('express');
const roomRouter = express.Router();
const {allotRoomsToStudents,removeRoomAllotments,reassignStudentRoom,swapStudentRooms} = require('../../controllers/Room/roomController');


roomRouter.post('/allot-rooms/:hostelId', allotRoomsToStudents);
roomRouter.delete('/remove-allotment/:hostelId',removeRoomAllotments);
roomRouter.post('/reassign-room',reassignStudentRoom);
roomRouter.post('/swap-rooms',swapStudentRooms);



module.exports=roomRouter;

