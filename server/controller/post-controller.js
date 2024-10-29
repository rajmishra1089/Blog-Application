const Post = require('../models/post');
const User = require('../models/user');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

// Multer setup to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createPost = [
  upload.single('photo'), // Middleware to handle image upload
  async (req, res) => {
    try {
      const { title, body, user } = req.body;

      // Check if a file is attached
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded. Please attach a photo to create a post.',
        });
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: "blog-application",
        width: 300, // optional
        crop: "scale", // optional
      });

      // Create a new post object
      const post = new Post({
        title,
        body,
        photo: {
          public_id: result.public_id,
          url: result.secure_url,
        },
        user,
      });

      // Save the post to the database
      const savedPost = await post.save();

      // Associate the post with the user
      const addPostToUser = await User.findByIdAndUpdate(
        user,
        { $push: { post: savedPost._id } },
        { new: true }
      ).populate("post").exec();

      res.json({
        post: savedPost,
        success: true,
      });
    } catch (error) {
      console.log('Error while creating post:', error);
      return res.status(500).json({
        error: 'Error while creating post',
      });
    }
  },
];

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().exec();
    res.json({
      posts,
      success:true
    });
  } catch (error) {
    console.log('Error while getting all posts:', error);
    return res.status(500).json({
      error: 'Error while getting all posts',
    });
  }
};
