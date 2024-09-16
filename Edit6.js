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



import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Initialize user state
  const [user, setUser] = useState({
    name: '',
    email: '',
    balance: '',
  });

  // User details (assumed to be sent in the request)
  const firstName = 'Ram';
  const lastName = 'Krishna';
  const email = 'Ram@example.com';
  const password = 'ram123';
  const userID = '12345'; // Example userID

  const navigate = useNavigate();

  // Fetch user details with POST request when the page loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            userId: userID,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          }),
        });

        // If the response is successful, parse the JSON data
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.name, // Assuming the API returns the name
            email: data.email, // Assuming the API returns the email
            balance: data.balance, // Assuming the API returns the balance
          });
        } else {
          console.error('Failed to fetch user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Call the function to fetch user details
    fetchUserDetails();
  }, [firstName, lastName, email, password, userID]); // Dependencies array

  return (
    <div className="home-container">
      {/* User Profile Section */}
      <div className="profile-container">
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Account Balance: {user.balance}</p>
      </div>

      {/* Main Actions: Money Transfer, Money Tracking, Reports */}
      <div className="actions-container">
        {/* Money Transfer Section */}
        <div className="action-box transfer-box">
          <h3>Money Transfer</h3>
          <p>Send money securely to other accounts</p>
          <button className="action-btn" onClick={() => navigate('/transfer')}>
            Transfer Now
          </button>
        </div>

        {/* Money Tracking Section */}
        <div className="action-box tracking-box">
          <h3>Accounts</h3>
          <p>Track all your recent transactions</p>
          <button className="action-btn" onClick={() => navigate('/tracking')}>
            Track Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;


To modify your code so that the success or failure of the transaction is shown after receiving the response from the API, and to ensure that senderPin, receiverAccountNumber, receiverIFSC, and amount are passed as parameters in the POST request, I made the necessary changes. Here’s the updated code:

Updated Code:

import React, { useState } from 'react';
import axios from 'axios';
import './Transfer.css';

function Transfer() {
  // State for form inputs
  const [senderId, setSenderId] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [receiverIFSC, setReceiverIFSC] = useState('');
  const [amount, setAmount] = useState('');
  const [senderPin, setSenderPin] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null); // To display success or failure

  // Function to handle the transfer
  const handleTransfer = () => {
    // Make the POST request with axios
    axios.post('/api/transfer', {
      senderId, // Sender ID
      senderPin, // Sender PIN
      receiverAccountNumber, // Receiver Account Number
      receiverIFSC, // Receiver IFSC
      amount, // Amount to transfer
    })
      .then((response) => {
        setTransactionStatus('Transfer successful!'); // Show success message
        alert('Transfer successful!');
      })
      .catch((err) => {
        setTransactionStatus('Transfer failed!'); // Show failure message
        alert('Transfer failed!');
        console.error(err);
      });
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Money</h2>

      {/* Sender Account Number Input */}
      <div className="ifield">
        <input
          type="text"
          placeholder="Account No"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Receiver Account Number Input */}
      <div className="ifield">
        <input
          type="text"
          placeholder="Receiver Account Number"
          value={receiverAccountNumber}
          onChange={(e) => setReceiverAccountNumber(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Receiver IFSC Input */}
      <div className="ifield">
        <input
          type="text"
          placeholder="Receiver IFSC"
          value={receiverIFSC}
          onChange={(e) => setReceiverIFSC(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Amount Input */}
      <div className="ifield">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Sender PIN Input */}
      <div className="ifield">
        <input
          type="password"
          placeholder="Sender PIN"
          value={senderPin}
          onChange={(e) => setSenderPin(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Transfer Button */}
      <button className="transfer-btn" onClick={handleTransfer}>Transfer</button>

      {/* Display Transaction Status */}
      {transactionStatus && (
        <p className={transactionStatus.includes('successful') ? 'success' : 'failure'}>
          {transactionStatus}
        </p>
      )}
    </div>
  );
}

export default Transfer;

Changes and Enhancements:

1. State Management:

Added state for receiverAccountNumber, receiverIFSC, and transactionStatus.

transactionStatus is used to display a success or failure message after the transfer.



2. Handle POST Request:

The handleTransfer function sends a POST request using axios.post with all required parameters: senderId, senderPin, receiverAccountNumber, receiverIFSC, and amount.



3. Transaction Status:

After the response is received, the transactionStatus state is updated with either "Transfer successful!" or "Transfer failed!" based on the API response.

A message is displayed on the page to inform the user about the success or failure of the transaction.



4. Error Handling:

The .catch block logs the error and displays the failure message to the user.



5. UI Enhancements:

A conditional <p> element is added below the form to display the transaction status.

If the transaction is successful, it will display a success message, and if it fails, it will show a failure message. The class names (success or failure) can be styled using CSS to make the message stand out.




Example CSS (Transfer.css):

You can add these styles to highlight success and failure messages.

.success {
  color: green;
  font-weight: bold;
}

.failure {
  color: red;
  font-weight: bold;
}

.transfer-container {
  /* Your existing styles */
}

.input-field {
  /* Your existing styles */
}

.transfer-btn {
  /* Your existing styles */
}

Backend API Endpoint:

Make sure your backend /api/transfer endpoint is set up to accept the following parameters:

senderId

senderPin

receiverAccountNumber

receiverIFSC

amount


It should respond with a success or failure status accordingly.

This setup will send the correct POST request with all the necessary parameters and display the success or failure of the transaction based on the API response. Let me know if you need further assistance!

            
