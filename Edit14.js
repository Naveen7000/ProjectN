To update your Home component so that you:

1. Retrieve the userId from the login page.


2. Include the JWT token from login as a Bearer token in the Authorization header when fetching user details.



You need to:

Pass the userId from the login page (or retrieve it from localStorage).

Retrieve the JWT token from localStorage (or from a React context).

Use the token in the Authorization header when making API calls.


Here's an updated version of your code:

import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState({
    lastName: '',
    firstName: '',
    email: '',
    balance: ''
  });

  const navigate = useNavigate();

  // Retrieve userId and token from localStorage (or from some context if you prefer)
  const userId = localStorage.getItem('userId');  // Assuming userId was saved after login
  const token = localStorage.getItem('authToken');  // JWT token saved after login

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/getUser", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`, // Add the Bearer token in the Authorization header
          },
          body: new URLSearchParams({ userId: userId })
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            balance: `$${data.balance}`,  // Assuming balance is returned as a number
          });
        } else {
          console.error('Failed to fetch user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Ensure userId and token exist before attempting to fetch user details
    if (userId && token) {
      fetchUserDetails();
    } else {
      console.error("User ID or token is missing");
      // You might want to navigate to the login page if they are missing
      navigate('/login');
    }
  }, [userId, token, navigate]);

  return (
    <div className="home-container">
      {/* User Profile Section */}
      <div className="profile-container">
        <h2>Welcome, {user.firstName} {user.lastName}</h2>
        <p>Email: {user.email}</p>
        <p>Account Balance: {user.balance}</p>
      </div>

      {/* Main Actions: Money Transfer, Money Tracking, Reports */}
      <div className="actions-container">
        {/* Money Transfer Section */}
        <div className="action-box transfer-box">
          <h3>Money Transfer</h3>
          <p>Send money securely to other accounts</p>
          <button
            className="action-btn"
            onClick={() => navigate('/transfer')}
          >
            Transfer Now
          </button>
        </div>

        {/* Money Tracking Section */}
        <div className="action-box tracking-box">
          <h3>Accounts</h3>
          <p>Track all your recent transactions</p>
          <button
            className="action-btn"
            onClick={() => navigate('/tracking')}
          >
            View Transactions
          </button>
        </div>

        {/* Reports Section */}
        <div className="action-box reports-box">
          <h3>Reports</h3>
          <p>View detailed financial reports</p>
          <button
            className="action-btn"
            onClick={() => navigate('/reports')}
          >
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

Key Updates:

1. Retrieve userId and JWT token from localStorage:

The userId and authToken are assumed to be saved in localStorage after the user logs in successfully.

If you're using context, you can pass userId and the token from context instead of localStorage.



2. Pass the JWT token in the Authorization header:

The token is passed as a Bearer token in the Authorization header when fetching user details from the API.



3. Check for missing userId or token:

If either userId or token is missing, you should handle this appropriately (e.g., navigate the user back to the login page).




Where to Set userId and authToken:

You should ensure that userId and the JWT token are saved in localStorage (or context) after a successful login in your Login component. For example:

// After successful login in the Login component
localStorage.setItem('userId', userId);  // Store userId
localStorage.setItem('authToken', token);  // Store JWT token

This will make the userId and authToken available across your app.

Security Note:

While storing JWT tokens in localStorage is simple, it's vulnerable to XSS attacks. You might want to consider storing the token in an HTTP-only cookie for enhanced security, which prevents access to the token from JavaScript.


