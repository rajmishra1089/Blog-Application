import {  createContext , useState,useEffect} from "react";
import axios from "axios";
const userContext=createContext();

const UserProvider = ({children})=>{
     const backendUrl = process.env.REACT_APP_API_BASE_URL;
    const [user,setUser]=useState({
        name:"",
        _id:"",
        posts:[]
    })
    const [loading, setLoading] = useState(true); // Manage loading state
    const login = (userData) => {
       setUser({
          name: userData.name,
          _id: userData._id,
          posts: userData.posts || [], // Optional: include posts if available
        });
       
      };
      const [myPosts,setMyPosts]=useState("home");
     // Restore session using the token on initial render
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/getUserData`, {
          withCredentials: true, // Include cookies in the request
        });

        if (res.data.success) {
          setUser(res.data.user); // Set user data in state
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setLoading(false); // Set loading to false after the check
      }
    };

    restoreSession();
  }, []);
    const logout = ()=>{
        setUser({
            name:"",
            _id:"",
            posts:[]
        })
    }
    if (loading) return <div>Loading...</div>;
    const value={user,setUser,logout,login,myPosts,setMyPosts}
    return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export {UserProvider,userContext}
