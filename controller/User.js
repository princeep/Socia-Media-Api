const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    if (!name || !email || !password || !confirm_password) {
        res.send({ messge: "Enter required fields" })
    }
    if (password !== confirm_password) {
        res.send({ message: "don't match password" })
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
        const newuser = await newUser.save();
            const save_User = await User.findOne({ email: email })
            const token = jwt.sign({ save_User }, process.env.SECRET_KEY, { expiresIn: '1h' })
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token, "user":newuser})
        } catch (error) {
            res.send({ message: "Registration failed" })
        }
    }
}


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.send({ message: "Enter required fields" })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            res.send({ message: "User not registered" })
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            res.send({ message: "passwords do not match" })
        }
        if ((user.email === email) && checkPassword) {
            const token = await jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1h" })
            res.send({ message: "Login success", token: token })
        }
    } catch (error) {
        console.log(error)
    }
}


const updatePassword = async (req, res) => {

    try {
        const { password, userId, confirm_password } = req.body;
        if (password !== confirm_password) {
            res.send({ message: "don't match your password" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const data = await User.findByIdAndUpdate({ _id: userId }, {
            $set: {
                password: hashPassword
            }
        });
        res.status(200).send({ message: "password updated successfully" })

    } catch (error) {
        console.log(error)
    }

}


const sendUserPasswordEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.send({ message: "Please enter your email" })
    }
    const checkEmail = await User.findOne({ email: email })
    if (!checkEmail) {
        res.send({ message: "user not registered" })
    }
    if (checkEmail) {
        const secret = checkEmail._id + process.env.SECRET_KEY;
        const token = jwt.sign({ user: checkEmail }, secret, {
            expiresIn: "15m"
        });
        const link = `http://localhost:3000/api/user/reset/${checkEmail._id}/${token}`

        console.log(link);
        res.send({ message: "success password reset Check email" })
    }
}

const userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await User.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await User.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
  }



module.exports = { userRegistration, Login, updatePassword, sendUserPasswordEmail, userPasswordReset }