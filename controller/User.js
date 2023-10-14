const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password) {
        res.send({messge:"Enter required fields"})
    }
    const user = await User.findOne({ email: email });
    if (user) {
        res.send({ message: "Emial already registered" })
    }
    if (password === confirm_password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                name: name,
                email: email,
                password: hashPassword
            })
            await newUser.save();
            const save_User = await User.findOne({ email: email })
            const token = jwt.sign({save_User}, process.env.SECRET_KEY, { expiresIn: '1h' })
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
        } catch (error) {
            res.send({ message: "Registration failed" })
        }
    } 
}


const Login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            res.send({message:"Enter required fields"})
        }
        const user = await User.findOne({email:email});
        if(!user){
            res.send({message:"User not registered"})
        }
        const checkPassword = await bcrypt.compare(password,user.password)
        if((user.email === email)&&checkPassword){
            const token = await jwt.sign({user},process.env.SECRET_KEY,{expiresIn:"1h"})
            res.send({message:"Login success",token:token})
        }
    } catch(error){
        console.log(error)
    }
}

module.exports = { userRegistration,Login }