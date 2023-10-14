const express = require('express');
const userController = require("../controller/User");
const userRoute = express.Router();


userRoute.post("/register",userController.userRegistration);


module.exports = userRoute;
