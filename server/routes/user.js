const express=require('express')

router=express.Router();

const {signUp,login,logout,getUserData}=require('../controller/user-controller')

router.post('/signUp',signUp);
router.post('/login',login);
router.get('/logout',logout);
router.get('/getUserData',getUserData);
module.exports=router