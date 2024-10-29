import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { userContext } from '../userContext';
import './Post.css';

export default function Post({ post }) {
    const { user, setUser } = useContext(userContext);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [commentsCache, setCommentsCache] = useState([]);
    const [commentCount, setCommentCount] = useState(post?.comments?.length || 0); // Initialize with the current length
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [liked, setLiked] = useState(false);
    const backendUrl = process.env.REACT_APP_API_BASE_URL;
    console.log(user)
    // Check if the user has liked the post
    useEffect(() => {
        const checkUserLike = async () => {
            if (user && post) {
                try {
                    const res = await axios.post(
                        `${backendUrl}/like/checkUserLike`,
                        { post: post._id, user: user._id },
                        { withCredentials: true }
                    );
                    if (res.data.success) {
                        setLiked(res.data.liked); // Set liked state based on response
                    }
                } catch (err) {
                    console.log('Error checking like status:', err);
                }
            }
        };

        checkUserLike();
    }, [user, post]);

    const toggleComments = async () => {
        if (!showComments && commentsCache.length === 0) {
            try {
                const allComments = []; // To store comments fetched from API
    
                // Loop through each comment ID in the post.comments array
                for (const commentId of post.comments) {
                    const res = await axios.post(
                        `${backendUrl}/comment/getComment`, 
                        { id: commentId }, // Send the current comment ID
                        { withCredentials: true }
                    );
    
                    if (res.data.success) {
                        allComments.push(res.data.comment); // Push the retrieved comment to the array
                    } else {
                        console.log('Comment not found for ID:', commentId);
                    }
                }
    
                // Set the comments cache with all retrieved comments
                setCommentsCache(allComments);
            } catch (err) {
                console.log('Error fetching comments:', err);
            }
        }
        setShowComments((prev) => !prev);
    };
    
    

    const handleLike = async () => {
        try {
            const res = await axios.post(
                `${backendUrl}/like/toggleLikePost`,
                { post: post._id, user: user._id },
                { withCredentials: true }
            );
            if (res.data.success) {
                setLiked(!liked);
                setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

                // Update user context to reflect the latest post details
                setUser((prevUser) => ({
                    ...prevUser,
                    posts: prevUser.posts.map((p) =>
                        p._id === post._id ? res.data.post : p
                    ),
                }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const submitComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(
                `${backendUrl}/comment/createComment`,
                { post: post._id, user: user._id, commentByUser: newComment },
                { withCredentials: true }
            );
            if (res.data.success) {
                // Ensure that res.data.comments is an array
                const comments = res.data.comments || [];
                setCommentsCache(comments);
                setCommentCount((prevCount) => prevCount + 1); // set comment count
                setUser((prevUser) => ({
                    ...prevUser,
                    posts: prevUser.posts.map((p) =>
                        p._id === post._id ? { ...p, comments } : p // Update comments in user context
                    ),
                }));
                setNewComment(''); // Clear input field
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="post-card">
            <h2 className="post-title">{post.title}</h2>
            {post.photo && (
                <div className="post-image">
                    <img src={post.photo.url} alt={post.title} />
                </div>
            )}
            <p className="post-body">{post.body}</p>
            <div className="post-info">
                <span onClick={handleLike}>
                    {liked ? '👎 Unlike' : '👍 Like'} ({likesCount})
                </span>
                <span onClick={toggleComments}>
                    💬 Comments ({commentCount})
                </span>
            </div>
            {showComments && (
                <div className="comments-section">
                    <div className="comments">
                        {commentsCache.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment}</p> {/* Display only the comment text */}
                            </div>
                        ))}
                    </div>
                    <div className="add-comment">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button onClick={submitComment}>Post</button>
                    </div>
                </div>
            )}


        </div>
    );
}
