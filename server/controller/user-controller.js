const User=require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.signUp=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({//400 means bad request
                success:false,
                message:"User already existing with given email"
            })
        }
        let hashedPassword; 
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({//500 means internal server error
                success:false,
                message:'could not hash the password ,please register again,server error'
            })
        }
        const user=User.create({
            name,email,password:hashedPassword
        })
        return res.status(201).json({//201 means created
            success:true,
            message:'new user signed up successfully'
        })
    }
    catch(err){
        console.log('issue in signup ,please do it again');
        return res.status(200).json({
            success:false,
            message:"issue in signup ,please do it again"
        })
    }
}

exports.login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        // console.log(email,password)
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Not already Registered , please signin first"
            });
        }
        const payload = {
            email:user.email,
            id:user._id,
        }
        // console.log(user)
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign(payload,
                process.env.JWT_KEY,
                {
                    expiresIn:"2h",
                }
            );
            user = user.toObject()
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };
            res.cookie("token",token,options)
            return res.status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully",
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid Password"
            })
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ 
            success:false,
            message:"Login Failed"
        })
    }
}

exports.logout=async(req,res)=>{
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
}


exports.getUserData = async (req, res) => {
    try {
      // Check for token in cookies
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "No token found" });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded.id).select("-password"); // Exclude password
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log("Error fetching user:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
  
