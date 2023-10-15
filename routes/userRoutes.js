const express = require('express');
const userController = require("../controller/User");
const verifyToken = require('../middleware/userAuth');
const userRoute = express.Router();

// userRoute.use("/changePassword",verifyToken);
userRoute.post("/register",userController.userRegistration);
userRoute.post("/login",userController.Login);
userRoute.post("/changePassword",verifyToken,userController.updatePassword);


module.exports = userRoute;
