const express = require('express');
const studentRouter = express.Router();

const {getStudentDetails} = require('../../controllers/Student/studentController');




studentRouter.get('/',getStudentDetails);

module.exports = studentRouter;






