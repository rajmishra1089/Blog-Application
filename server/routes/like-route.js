const express = require('express')

const router = express.Router()

const {toggleLikePost,checkUserLike} = require('../controller/like-controller')
const {auth} = require("../middleware/Auth")
router.post('/toggleLikePost',auth,toggleLikePost);
router.post('/checkUserLike',checkUserLike);
module.exports=router