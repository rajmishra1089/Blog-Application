const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    },
    commentByUser:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
});

module.exports = mongoose.model("Comment", commentSchema);