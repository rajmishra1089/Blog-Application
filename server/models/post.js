const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    photo:{
        public_id:{
            type: String,
            required:true
        },
        url:{
            type: String,
            required:true
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like",
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],
});
module.exports=mongoose.model("Post",postSchema);