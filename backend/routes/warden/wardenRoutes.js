const express = require('express');

const wardenRouter= express.Router();

const {getWardens} =require('../../controllers/warden/warden.js');


wardenRouter.get('/',getWardens);

module.exports=wardenRouter;

