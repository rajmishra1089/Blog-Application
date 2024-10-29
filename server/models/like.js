const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model("Like", likeSchema);