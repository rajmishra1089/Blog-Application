import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './userContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider >
     <ToastContainer />
    <App />
  </UserProvider>
);


