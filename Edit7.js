Here's a React code implementation for a Register Page where the user enters their first name, last name, email, and password, and after submission, the response from the backend is displayed in a pop-up with the user details like userId, accountNumber, ifscCode, and pin.

Register Page - React Code

import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/register', null, {
        params: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      });
      setUserDetails(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {!userDetails ? (
        <>
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              required
            />
            <button type="submit" className="submit-btn">Register</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      ) : (
        <div className="welcome-popup">
          <h2>Welcome, {userDetails.firstName} {userDetails.lastName}!</h2>
          <p>Your account has been created successfully.</p>
          <div className="user-details">
            <p><strong>User ID:</strong> {userDetails.userId}</p>
            <p><strong>Account Number:</strong> {userDetails.accountNumber}</p>
            <p><strong>IFSC Code:</strong> {userDetails.ifscCode}</p>
            <p><strong>Pin:</strong> {userDetails.pin}</p>
          </div>
          <button onClick={() => window.location.reload()} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
}

export default Register;

CSS for the Register Page (Register.css)

.register-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px;
  margin-top: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.welcome-popup {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.welcome-popup h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.welcome-popup p {
  font-size: 16px;
  margin-bottom: 15px;
}

.user-details p {
  margin: 8px 0;
  font-size: 16px;
}

.close-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #0056b3;
}

Explanation:

1. Register Form:

This includes fields for first name, last name, email, and password.

Form submission triggers a POST request to the backend using the axios library, sending the user input as request parameters.



2. Handling the Response:

Upon successful registration, the response contains user details (userId, accountNumber, ifscCode, pin), which are displayed on the page in a pop-up style format.



3. Error Handling:

If there's an error during the registration process, an error message is displayed below the form.



4. Welcome Popup:

Once the registration is successful, a beautiful pop-up with user details is shown.

The user can click a "Close" button to reload the page, simulating a session reset or redirection.




Enhancements:

The page is clean, responsive, and user-friendly.

The welcome pop-up appears with a smooth layout to make it visually engaging.

The form has simple and intuitive validation.


This layout should provide a clean and professional registration page. Let me know if you'd like to add any more features or modify the design!




#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#-

  To make the <p> tag clickable and redirect to the Register page when clicked, you can use React Router's useNavigate hook. This will allow you to handle client-side navigation between pages.

Here’s how you can modify your login page to make the Signup text clickable:

Updated Login Page with Clickable Signup

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Login.css';

function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = () => {
    if (userID && password) {
      // Perform your login logic here
      navigate('/home'); // Redirect to Home page after successful login
    } else {
      alert('Please enter your email and password.');
    }
  };

  // Navigate to the register page on click
  const handleSignupClick = () => {
    navigate('/register'); // Redirect to Register page
  };

  return (
    <div className="login-container">
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

        {/* Make the Signup text clickable */}
        <p className="signup-text" onClick={handleSignupClick}>
          Don't have an account? Sign up here.
        </p>
      </div>
    </div>
  );
}

export default Login;

Key Points:

useNavigate: We use useNavigate from react-router-dom to handle navigation between pages.

handleSignupClick: This function will be triggered when the user clicks the "Sign up here" text. It redirects the user to the Register page using navigate('/register').

Clickable Text: The <p> element for the signup text has an onClick event that triggers the navigation.


CSS (Optional, for styling the clickable text)

You can add some styling to make the signup text look more clickable and user-friendly.

.signup-text {
  color: #007bff;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
}

.signup-text:hover {
  text-decoration: underline;
}

Steps to Ensure:

1. Ensure that React Router is properly set up in your application with routes defined for both the login and register pages.


2. Your route configuration should look something like this:



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} /> {/* Default to Login */}
      </Routes>
    </Router>
  );
}

export default App;

This will ensure that when the user clicks the Sign up text, it will navigate to the Register page, providing a smooth user experience.


#-#-#--#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#-#-#-

  To achieve this, you can update the functionality of the close button in the pop-up window to not only close the pop-up but also navigate the user to the login page.

Key Steps:

1. Handle the close button click event in the pop-up.


2. Use the useNavigate hook from react-router-dom to redirect the user to the login page.



Here’s how you can modify the existing code for the Register page:

Updated Register Page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './Register.css';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userDetails, setUserDetails] = useState(null); // For storing the user details response
  const navigate = useNavigate(); // For navigation

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', {
        firstName,
        lastName,
        email,
        password
      });

      setUserDetails(response.data); // Store user details in state
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleClosePopup = () => {
    // Close the pop-up and navigate to login page
    setUserDetails(null);
    navigate('/login'); // Navigate to login after closing the pop-up
  };

  return (
    <div className="register-container">
      {!userDetails ? (
        <div className="register-box">
          <h2>Register</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>
        </div>
      ) : (
        <div className="popup">
          <div className="popup-content">
            <h2>Welcome {userDetails.firstName} {userDetails.lastName}!</h2>
            <p>User ID: {userDetails.userId}</p>
            <p>Account Number: {userDetails.accountNumber}</p>
            <p>IFSC Code: {userDetails.ifscCode}</p>
            <p>PIN: {userDetails.pin}</p>
            <button className="close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;

Key Changes:

1. handleClosePopup: When the close button is clicked, the userDetails is set to null to hide the pop-up, and navigate('/login') is called to redirect the user to the login page.


2. Conditionally Render: The registration form is shown only if userDetails is null. Once the user registers and gets the response, the pop-up is displayed with the user information. After clicking the Close button, it navigates to the login page.



Popup CSS (for a more appealing layout):

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.popup-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.popup-content p {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.close-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.close-btn:hover {
  background-color: #0056b3;
}

Explanation:

Popup Styling: The pop-up covers the whole screen with a semi-transparent background (rgba(0, 0, 0, 0.5)) and centers the pop-up content.

Close Button: When clicked, it triggers the handleClosePopup function to both close the pop-up and navigate to the login page.


With this code, once the user successfully registers, they will see a pop-up with their user details, and upon clicking Close, they will be redirected to the login page.

                



