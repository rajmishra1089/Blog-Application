import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userContext } from '../userContext';
export default  function Login() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(userContext);
  const backendUrl = process.env.REACT_APP_API_BASE_URL;
  const handleToggle = () => {
    setIsNewUser(!isNewUser);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        if(isNewUser){
            const res= await axios.post(`${backendUrl}/user/signUp`,{name,email,password}, { withCredentials: true })
            if(res.data.success){
                toast.success('Successfully signed up!');
                setIsNewUser(false);
            }
            else{
                toast.error('Try Signing Again!');
            }
        }
        else{
            const res=await axios.post(`${backendUrl}/user/login`,{email,password}, { withCredentials: true })
            console.log(res)
            if(res.data.success){
                toast.success('Logged In successfully!')
                login(res.data.user)
            }
            else{
                toast.error("Wrong Credentials")
            }
        }
    }catch(error){
        console.log(error)
        toast.error("Server error")
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{isNewUser ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {isNewUser && (
          <>
            <label style={styles.label}>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </label>
          </>
        )}
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          {isNewUser ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isNewUser ? 'Already a user?' : 'New user?'}{' '}
        <span onClick={handleToggle} style={styles.toggleLink}>
          {isNewUser ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#2C3E50',
    color: '#ECF0F1',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '10px',
  },
  toggleLink: {
    color: '#2C3E50',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};
