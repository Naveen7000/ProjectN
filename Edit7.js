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

