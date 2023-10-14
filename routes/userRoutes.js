const express = require('express');
const userController = require("../controller/User");
const userRoute = express.Router();


userRoute.post("/register",userController.userRegistration);
userRoute.post("/login",userController.Login);


module.exports = userRoute;
