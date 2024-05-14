const express = require('express');
const hostelRouter = express.Router();

const {createHostel,removeHostel,getHostels,getHostelDetails }= require('../../controllers/hostel/hostelController');

hostelRouter.post('/add-hostel',createHostel);
hostelRouter.delete('/remove-hostel/:id',removeHostel);

hostelRouter.get('/',getHostels);
hostelRouter.get('/:id',getHostelDetails);


module.exports = hostelRouter;
