const express = require('express');
const userController = require("../controller/User");
const verifyToken = require('../middleware/userAuth');
const userRoute = express.Router();

userRoute.post("/register",userController.userRegistration);
userRoute.post("/login",userController.Login);
userRoute.post("/changePassword",verifyToken,userController.updatePassword);
userRoute.post("/send-email",userController.sendUserPasswordEmail);
userRoute.post("/reset-password/:id/:token",userController.userPasswordReset)


module.exports = userRoute;
