import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Updated CSS for the modern design

function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (userID && password) {
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Handle successful login
          // For example, store token or redirect
          navigate('/home');
        } else {
          // Handle errors
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please enter your User ID and Password.');
    }
  };

  return (
    <div className="login-container" id="login">
      <div className="overlay"></div>
      <div className="login-box">
        <h2>Welcome to MoneyFlow</h2>
        <p>Transfer money securely and easily</p>
        <div className="input-container">
          <input
            type="text"
            placeholder="User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button onClick={handleLogin} className="login-btn">
          Login
        </button>
        <p className="signup-text">Don't have an account? Sign up here.</p>
      </div>
    </div>
  );
}

export default Login;


Home.js
import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    balance: '',
  });

  const userID = '12345'; // Assume this is the logged-in user's ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://your-backend-url/api/users?userId=${userID}`); // Pass userID in query string
        const data = await response.json();

        setUser({
          name: data.name,
          email: data.email,
          balance: data.balance,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userID]);

  return (
    <div className="home-container">
      <div className="profile-container">
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Account Balance: {user.balance}</p>
      </div>

      <button onClick={() => navigate('/another-page')}>Go to another page</button>
    </div>
  );
}

export default Home;

              
