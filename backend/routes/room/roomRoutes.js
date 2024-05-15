const express = require('express');
const roomRouter = express.Router();
const {allotRoomsToStudents,removeRoomAllotments} = require('../../controllers/Room/roomController');


roomRouter.post('/allot-rooms/:hostelId', allotRoomsToStudents);
roomRouter.delete('/remove-allotment/:hostelId',removeRoomAllotments)

module.exports=roomRouter;

