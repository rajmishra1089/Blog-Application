const express = require("express")

router=express.Router();

const {createPost,getAllPosts} = require("../controller/post-controller")
const {auth} = require("../middleware/Auth")
router.post("/createPost",auth,createPost);
router.get("/getAllPosts",auth,getAllPosts);
module.exports=router