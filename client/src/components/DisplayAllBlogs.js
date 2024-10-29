import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { userContext } from '../userContext';
import Post from './Post';

export default function DisplayAllBlogs() {
    const { user, setUser } = useContext(userContext);
    const backendUrl = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get(`${backendUrl}/post/getAllPosts`, { withCredentials: true });
                if (res.data.success) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        posts: res.data.posts
                    }));
                }
            } catch (err) {
                console.log(err);
            }
        };
        getPosts();
    }, [setUser]);

    return (
        <div className="blog-container">
            <h1 className="welcome">Hi {user.name}</h1>
            {user.posts && user.posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
}
