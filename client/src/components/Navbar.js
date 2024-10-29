import React, { useContext } from 'react';
import { userContext } from '../userContext';
import Login from './Login';
import axios from 'axios';

export default function Navbar() {
  const backendUrl = process.env.REACT_APP_API_BASE_URL;
  const { user,logout,setMyPosts} = useContext(userContext);
  const handleLogout = async()=>{
    try {
      
      await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true, 
      });
  
      // Clear the frontend state
      logout();
  
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  }
  const Blog = (a)=>{
    if(a==="home"){
      setMyPosts("home")
    }
    else if(a==="myBlogs"){
      setMyPosts("myBlogs");
    }
    else{
       setMyPosts("createBlog")
    }
  }
  return (
    <div>
      <div
        style={{
          height: '60px',
          backgroundColor: '#2C3E50',
          color: '#ECF0F1',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>My Blog</div>
        {user?.name && user.name.trim() !== "" && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ cursor: 'pointer', transition: '0.3s' }} onClick={()=>Blog("home")}>Home</div>
            <div style={{ cursor: 'pointer', transition: '0.3s' }} onClick={()=>Blog("myBlogs")}>My Blogs</div>
            <div style={{ cursor: 'pointer', transition: '0.3s' }} onClick={()=>Blog("createBlog")}>Create Blog</div>
            
            <button
              style={{
                backgroundColor: '#E74C3C',
                color: 'white',
                fontSize: '16px',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#C0392B')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#E74C3C')}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
     
    </div>
  );
}
