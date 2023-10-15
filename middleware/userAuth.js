const jwt = require("jsonwebtoken");
const User = require("../models/User")

const verifyToken = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        token = authorization.split(' ')[1]
          const { userID } = jwt.verify(token, process.env.SECRET_KEY)
          req.user = await User.findById(userID).select('-password')
  
        next()
      } catch (error) {
        console.log(error)
        res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
      }
    }
    if (!token) {
      res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
  }
  

module.exports = verifyToken;