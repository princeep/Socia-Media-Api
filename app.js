const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Hello, world!");
})


app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})