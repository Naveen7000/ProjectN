To modify your code so that it handles the login response properly (both successful and failed attempts) and shows the "Invalid Credentials" error in the UI instead of using alert(), you can follow these steps:

1. Handle the Bearer token from the API response when login is successful.


2. Display the error message from invalid login attempts in the UI.


3. Fix various syntactic and logical issues in your original code (such as navigate declaration, function definitions, and others).



Here’s a revised version of your Login component:

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure the CSS path is correct

function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for showing errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (userID && password) {
      try {
        const response = await fetch('http://localhost:8080/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            userId: userID,
            password: password,
          }),
        });

        const result = await response.text();

        if (result.startsWith('Bearer')) {
          // Assuming the token is returned as 'Bearer <token>'
          const token = result.split(' ')[1]; // Extract the token
          
          // Save the token in localStorage or context (optional)
          localStorage.setItem('authToken', token);

          // Redirect to the home page
          navigate('/home');
        } else {
          // Set error message for invalid credentials
          setErrorMessage('Invalid Credentials, Please try again');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    } else {
      setErrorMessage('Please enter your User ID and Password.');
    }
  };

  const handleSignupClick = () => {
    navigate('/register'); // Redirect to Register page
  };

  return (
    <div className="login-container" id="login">
      <div className="overlay"></div>
      <div className="login-box">
        <h2>Welcome to MoneyFlow</h2>
        <p>Transfer money securely and easily</p>

        {/* Error message display */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

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

        <p className="signup-text" onClick={handleSignupClick}>
          Don't have an account? Sign up here.
        </p>
      </div>
    </div>
  );
}

export default Login;

Key changes and explanation:

1. Error Handling:

I introduced the errorMessage state to display any login error messages directly in the UI.

Instead of alert(), any error messages (e.g., invalid credentials or missing fields) are rendered in the JSX under the form.



2. Token Handling:

When a login is successful and the response starts with "Bearer", the token is extracted and stored in localStorage. This can later be used for authenticated requests.



3. Fixed syntax issues:

Corrected the navigate call to be initialized properly using const navigate = useNavigate();.

Fixed incorrect event handlers like onClick and onChange to their correct syntactic forms (onClick={() => handleLogin()} instead of onclick=(handleLogin)).



4. CSS:

Ensure that the path to Login.css is correct and the class names (login-container, login-box, error-message, etc.) are styled appropriately for your UI.




Now, when a user logs in:

If credentials are valid, they are redirected to /home.

If credentials are invalid or there’s another issue, the appropriate error message is displayed on the login page.


          
