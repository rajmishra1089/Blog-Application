import React, { useContext, useState } from 'react';
import axios from 'axios';
import { userContext } from '../userContext';
import './CreateBlog.css'
export default function CreateBlog() {
  const backendUrl = process.env.REACT_APP_API_BASE_URL;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const {user} = useContext(userContext)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object to send both text and file data
    const formData = new FormData();
    formData.append('user',user._id)
    formData.append('title', title);
    formData.append('body', body);
    formData.append('photo', photo); // 'photo' should match the backend field name

    try {
      const response = await axios.post(
        `${backendUrl}/post/createPost`,
        formData, // Send formData as the body
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } } // Ensure multipart/form-data
      );

      

      if (response.data.success) {
        setMessage('Blog created successfully!');
        setTitle('');
        setBody('');
        setPhoto(null);
      } else {
        setMessage(response.data.error || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the blog.');
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Photo:</label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
