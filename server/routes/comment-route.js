const express = require("express")

const router =  express.Router()

const {createComment,getComment} = require("../controller/comment-controller")
const {auth} = require("../middleware/Auth")
router.post("/createComment",auth,createComment)
router.post("/getComment",auth,getComment);

module.exports=router