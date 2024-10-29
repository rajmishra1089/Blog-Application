const Post = require('../models/post');
const Like = require('../models/like');

exports.toggleLikePost = async (req, res) => {
    try {
        const { post, user } = req.body;

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ post, user });

        if (existingLike) {
            // User already liked the post, so unlike it
            await Like.findOneAndDelete({ post, user });
            const updatedPost = await Post.findByIdAndUpdate(
                post,
                { $pull: { likes: existingLike._id } },
                { new: true }
            ).populate("likes").exec();
            
            return res.json({
                success: true,
                post: updatedPost,
                liked: false,
            });
        } else {
            // User has not liked the post, so add like
            const newLike = new Like({ post, user });
            const savedLike = await newLike.save();

            const updatedPost = await Post.findByIdAndUpdate(
                post,
                { $push: { likes: savedLike._id } },
                { new: true }
            ).populate("likes").exec();
            
            return res.json({
                success: true,
                post: updatedPost,
                liked: true,
            });
        }
    } catch (error) {
        console.log('Error while toggling like on post:', error);
        return res.status(500).json({
            error: 'Error while toggling like on post',
        });
    }
};

exports.checkUserLike = async (req, res) => {
    try {
        const { post, user } = req.body;
        const result = await Like.findOne({ post: post, user: user });
        if (result) {
            return res.json({
                success: true,
                liked: true, // Indicate that the user has liked the post
            });
        }
        // User has not liked the post
        return res.json({
            success: true,
            liked: false, // Indicate that the user has not liked the post
        });
    } catch (error) {
        console.error('Error while checking user like:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
};
