const express = require('express');

const caretakerRouter = express.Router();

const {getCaretakers}=require('../../controllers/caretaker/caretaker.js');



caretakerRouter.get('/',getCaretakers);

module.exports=caretakerRouter;