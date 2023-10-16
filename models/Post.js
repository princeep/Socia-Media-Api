const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now(),
    }
})

postSchema.pre("save",async(req,res)=>{
    try{
        const user = await mongoose.model("User").findByIdAndUpdate(
            this.author,
            {$push:{posts:this._id}},
            {new:true},
        );

    } catch(error){
        console.log(error);
    }
})

const Post = mongoose.model("Post",postSchema);
module.exports = Post;