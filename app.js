const express = require("express");
const connectDB = require("./config/connectdb");
const dotenv = require("dotenv").config();
const User = require("./models/User")
const post = require("./models/Post");
const userRoute = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT;
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

connectDB(MONGO_URL)
app.use("/api/user",userRoute)
           

app.get("/",(req,res)=>{
    res.send("Hello, world!");
})

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})