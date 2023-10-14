const mongoose = require('mongoose');

const connectDB = async(MONGO_URL)=>{
    try{
        const dbOptions={
            dbName:"Social-Media-Api"
        }
        await mongoose.connect(process.env.MONGO_URL,dbOptions)
        console.log("Database connection successful")

    } catch(error){
        console.log("database connection error")
    }
}

module.exports = connectDB;