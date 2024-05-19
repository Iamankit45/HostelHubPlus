const express = require('express');
const fineRouter = express.Router();
const authMiddleware = require('../.././middlewares/authMiddleware');


const {getFinesForStudent,getFinesForCaretaker,payFine,imposeFine}= require('../../controllers/fine/fineController');

fineRouter.post('/impose-fine', authMiddleware, imposeFine);
fineRouter.get('/student', authMiddleware, getFinesForStudent);
fineRouter.get('/hostel/:hostelId', authMiddleware, getFinesForCaretaker);
fineRouter.patch('/pay/:fineId', authMiddleware, payFine);

module.exports=fineRouter;