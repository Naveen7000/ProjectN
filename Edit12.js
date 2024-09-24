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


  #-#-#-#--#-#-#-#-#--#-#-#-#-#-#--#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#--#-#-#-#-#-#-


Yes, you can retrieve user details from a JWT (JSON Web Token). JWTs typically consist of three parts: a header, a payload, and a signature. The payload contains the claims or data about the user, and this can include information like the user ID, email, roles, etc.

Here's how you can extract the payload (which contains user details) from a JWT on the client side:

Steps to decode JWT and retrieve user details

1. Decode the JWT: Since the JWT is a base64-encoded string, you can decode it to access the payload part.


2. Extract user details from the payload: The payload will contain claims, which are key-value pairs representing user details.



Example Code in React

If you're receiving a JWT upon login and you want to decode it to access user details, you can use a library like jwt-decode or decode it manually using base64.

Option 1: Using jwt-decode Library (Recommended)

You can install the jwt-decode package to make it easy to decode the token.

npm install jwt-decode

Then, in your React component:

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // Import jwt-decode to decode JWT
import './Login.css';

function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null); // State to store decoded user details
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
          // Extract the JWT token
          const token = result.split(' ')[1];

          // Save the token in localStorage
          localStorage.setItem('authToken', token);

          // Decode the JWT to get user details
          const decoded = jwt_decode(token);

          // Set the decoded user details in state
          setUserDetails(decoded);

          console.log('User details:', decoded); // You can view the user details here

          // Redirect to home page
          navigate('/home');
        } else {
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

        <p className="signup-text" onClick={() => navigate('/register')}>
          Don't have an account? Sign up here.
        </p>

        {/* Example showing user details */}
        {userDetails && (
          <div className="user-details">
            <p>Welcome, {userDetails.username}!</p>
            <p>Email: {userDetails.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

Explanation:

Token Decoding: After a successful login, the token is extracted from the response and decoded using the jwt-decode library.

User Details: Once the token is decoded, the user details are stored in the userDetails state and can be accessed or displayed in the UI.


Option 2: Manually Decoding JWT (Without Library)

If you don’t want to use an external library, you can manually decode the base64-encoded JWT like this:

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

You can then replace the jwt_decode(token) line with parseJwt(token) to decode the JWT manually.

JWT Payload Example:

A JWT payload might look like this:

{
  "userId": "12345",
  "username": "john_doe",
  "email": "john@example.com",
  "exp": 1700000000
}

You can now use this information to display user-specific data or store it for later use.

Important Notes:

1. Security: While you can decode the JWT on the client side, be careful with the information you store there. Sensitive data should not be stored in the JWT. Always verify the token on the server side.


2. Token Expiry: JWTs usually include an expiration time (exp). You should check if the token is still valid and handle token expiration appropriately.



    

          
