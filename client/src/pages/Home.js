import React,{useContext} from 'react'
import Navbar from '../components/Navbar'
import Login from '../components/Login'
import { userContext } from '../userContext'
import DisplayAllBlogs from '../components/DisplayAllBlogs';
import MyPosts from '../components/MyPosts';
import CreateBlog from '../components/CreateBlog';
export default function Home() {
  const { user ,myPosts} = useContext(userContext);
  return (
    <div>
      <Navbar/>
      {/* Check if the user is not logged in */}
      { !user || user.name === "" ? (
        <Login />
      ) : (
        // Only show blog-related components if the user is logged in
        <>
          { myPosts === "home" ? (
            <DisplayAllBlogs />
          ) : myPosts === "createBlog" ? (
            <CreateBlog />
          ) : (
            <MyPosts />
          )}
        </>
      )}
      
    </div>
  )
}
