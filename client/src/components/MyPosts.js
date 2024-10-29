import React, { useContext } from 'react';
import { userContext } from '../userContext';
import Post from './Post';

export default function MyPosts() {
    const { user } = useContext(userContext);

    return (
        <div className="blog-container">
            <h1 className="welcome">Hi {user.name}</h1>
            {user.posts &&
                user.posts
                    .filter((post) => post.user === user._id)
                    .map((post) => <Post key={post._id} post={post} />)
            }
        </div>
    );
}
