const express = require('express');
const cors = require('cors');
const app = express();
 
app.use(express.json());

app.use(cors({origin: 'https://blog-application-m70g.onrender.com',credentials: true })); 
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
 

const PORT = process.env.PORT || 4000;

//To connect to database
const dbConnect = require('./config/database'); 
dbConnect(); 

const user=require('./routes/user');
app.use('/user',user)

const post=require('./routes/post-route');
app.use('/post',post)

const like=require('./routes/like-route');
app.use('/like',like)

const comment=require('./routes/comment-route');
app.use('/comment',comment)

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})
