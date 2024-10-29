const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
    try {
        const { post, user, commentByUser } = req.body;

        // Validate required fields
        if (!post || !user || !commentByUser) {
            return res.status(400).json({
                success: false,
                error: 'Post, user, and comment content are required.',
            });
        }

        const comment = new Comment({
            post,
            user,
            commentByUser,
        });

        const savedComment = await comment.save();

        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $push: { comments: savedComment._id } },
            { new: true }
        )
            .populate("comments")
            .exec();

        res.json({
            success: true,
            post: updatedPost,
        });
    } catch (error) {
        console.log('Error while creating comment:', error);
        return res.status(500).json({
            success: false,
            error: 'Error while creating comment',
        });
    }
};

exports.getComment = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate that the id is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Comment ID is required.',
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                error: 'Comment not found.',
            });
        }

        res.json({
            success: true,
            comment: comment.commentByUser,
        });
    } catch (error) {
        console.log('Error while fetching comment:', error);
        return res.status(500).json({
            success: false,
            error: 'Error while fetching comment',
        });
    }
};
