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
    // Construct the URL with query parameters
    const url = `/api/transfer?senderId=${senderId}&receiverAccountNumber=${receiverAccountNumber}&receiverIFSC=${receiverIFSC}&amount=${amount}&senderPin=${senderPin}`;

    // Make the POST request with axios
    axios.post(url)
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

-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#--#-#-#-#-#-##-#--#-#-#-#-

pop up window 
To display a popup modal with a success message and a close button instead of showing the message at the bottom, you can use the built-in JavaScript window.alert() function or implement a custom modal using HTML, CSS, and React.

Here’s how you can create a custom popup modal that displays a success message and includes a close button:

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [transactionMessage, setTransactionMessage] = useState(''); // For success or failure message

  // Function to handle the transfer
  const handleTransfer = () => {
    // Construct the URL with query parameters
    const url = `/api/transfer?senderId=${senderId}&receiverAccountNumber=${receiverAccountNumber}&receiverIFSC=${receiverIFSC}&amount=${amount}&senderPin=${senderPin}`;

    // Make the POST request with axios
    axios.post(url)
      .then((response) => {
        setTransactionMessage('Transfer successful!'); // Set the success message
        setIsModalOpen(true); // Open the modal
      })
      .catch((err) => {
        setTransactionMessage('Transfer failed!'); // Set the failure message
        setIsModalOpen(true); // Open the modal
        console.error(err);
      });
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
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

      {/* Modal Popup for Success/Failure */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{transactionMessage}</h3>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transfer;

Explanation:

1. Modal State:

The isModalOpen state is used to control whether the modal is visible or hidden.

The transactionMessage state stores the success or failure message to display inside the modal.



2. Handling Transfer:

After the POST request succeeds or fails, the success or failure message is set, and the modal is opened by setting isModalOpen to true.



3. Closing the Modal:

The closeModal function sets isModalOpen to false, hiding the modal when the Close button is clicked.



4. Modal Popup:

A modal is conditionally rendered based on the value of isModalOpen.

The modal contains the transactionMessage (success or failure) and a Close button.




Modal Styles in Transfer.css:

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.close-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #0056b3;
}

Key Points:

1. Modal:

The modal covers the whole screen with a semi-transparent background and centers the message box using flex for alignment.

The modal will pop up whenever a transfer is successful or fails.



2. Close Button:

The close button in the modal allows the user to close the popup, hiding the modal and returning to the form.




This solution provides a neat, user-friendly way to display the transaction status as a popup.




-#-#-#-#--#-#-#-#-#--#-#-#-#--#-#-#-#-#-#--#-#-#-#-#-#-#-#--#-#-#-#-#-#--#-#-#-#-#-#--#-#--#-#-#-#-#--#-#-$-$-#-#


  To handle multiple response cases such as "Transfer successful", "Insufficient balance", and "Sender or receiver is not found", we will modify the UI to show appropriate messages based on the API response. We'll also make sure the modal is used to clearly display the corresponding message.

Updated React Code (Transfer.js):

import React, { useState } from 'react';
import axios from 'axios';
import './Transfer.css';

function Transfer() {
  const [senderId, setSenderId] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [receiverIFSC, setReceiverIFSC] = useState('');
  const [amount, setAmount] = useState('');
  const [senderPin, setSenderPin] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [transactionMessage, setTransactionMessage] = useState(''); // Transaction message state
  const [isSuccess, setIsSuccess] = useState(false); // State to track if the transfer was successful

  const handleTransfer = () => {
    const url = `/api/transfer?senderId=${senderId}&receiverAccountNumber=${receiverAccountNumber}&receiverIFSC=${receiverIFSC}&amount=${amount}&senderPin=${senderPin}`;

    axios.post(url)
      .then((response) => {
        const message = response.data; // Assuming the response contains the message directly
        
        // Handle different responses
        if (message === 'Transfer successful') {
          setIsSuccess(true);
        } else if (message === 'Insufficient balance') {
          setIsSuccess(false);
        } else if (message === 'Sender or receiver is not found') {
          setIsSuccess(false);
        }
        setTransactionMessage(message); // Set the response message
        setIsModalOpen(true); // Show the modal
      })
      .catch((err) => {
        setTransactionMessage('An error occurred. Please try again.');
        setIsSuccess(false);
        setIsModalOpen(true);
        console.error(err);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Money</h2>

      {/* Input fields */}
      <div className="ifield">
        <input
          type="text"
          placeholder="Sender Account No"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="ifield">
        <input
          type="text"
          placeholder="Receiver Account Number"
          value={receiverAccountNumber}
          onChange={(e) => setReceiverAccountNumber(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="ifield">
        <input
          type="text"
          placeholder="Receiver IFSC"
          value={receiverIFSC}
          onChange={(e) => setReceiverIFSC(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="ifield">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
        />
      </div>
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

      {/* Modal Popup for Success/Failure */}
      {isModalOpen && (
        <div className="modal">
          <div className={`modal-content ${isSuccess ? 'success' : 'failure'}`}>
            <h3>{transactionMessage}</h3>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transfer;

Explanation:

1. Handling Multiple Cases:

Based on the response from the server, the message (response.data) is checked:

If the message is "Transfer successful", we set the isSuccess state to true, and the UI will reflect the success message.

If the message is "Insufficient balance" or "Sender or receiver is not found", we set isSuccess to false and show the failure message in the modal.


The transaction message (transactionMessage) is updated with the response from the server and displayed in the modal.



2. Conditional Styling:

A new state isSuccess is used to apply conditional styling to the modal based on whether the transfer was successful or not. The modal content will have a different background color or design for success and failure cases.



3. Default Error Handling:

In case of an error (e.g., network issues), a fallback message "An error occurred. Please try again." is displayed.




Updated CSS (Transfer.css):

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 15px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-content.success {
  border-left: 6px solid #28a745; /* Green border for success */
}

.modal-content.failure {
  border-left: 6px solid #dc3545; /* Red border for failure */
}

.modal-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.close-btn {
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: #0056b3;
}

Key Changes in the CSS:

1. Success/Failure Modal:

For success responses, the modal gets a green border using .success.

For failure responses (like "Insufficient balance" or "Sender or receiver is not found"), the modal gets a red border using .failure.




What Happens Now:

1. Success Case:

If the response from the API is "Transfer successful", the modal will display the message in a green-bordered modal with the text "Transfer successful!".

The isSuccess state is set to true, applying the .success styling.



2. Failure Cases:

If the response is "Insufficient balance" or "Sender or receiver is not found", the modal will display the corresponding message in a red-bordered modal.

The isSuccess state is set to false, applying the .failure styling.



3. General Error Handling:

If there's an error in the request (network error, etc.), a generic error message "An error occurred. Please try again." is displayed in the modal.



4. Modal Design:

The modal is visually more distinct for success and failure cases:

Green for success (#28a745) to give the user positive feedback.

Red for failure (#dc3545), signaling an issue with the transfer.




5. User Experience:

The Close button allows the user to easily close the modal after seeing the transaction status.

The modal provides a clean, consistent way to show transaction results, making the interaction more user-friendly and visually engaging.




Example Walkthrough:

If a user initiates a transfer and the backend responds with "Transfer successful", the modal will slide in, display a green border with the message, and allow the user to close it.

If the transfer fails due to "Insufficient balance" or "Sender or receiver is not found", the modal will appear with a red border, showing the relevant error message, allowing the user to acknowledge and close it.


This design ensures that users can clearly understand the result of their actions in the app, whether the transaction succeeds or fails, with proper visual feedback.

  




#-#-#-#-#-#-#--#-#-#-#-#-#--#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#--#-#
  Thank you for providing the response structure. Based on this, I will create a complete solution that handles:

1. Pagination: As the response includes pageNumber, totalPages, and totalElements.


2. Transactions Display: I'll present the transactions in a list.


3. Handling Missing Data: Since some fields like senderAccountNumber may be null, we will handle that gracefully.


4. Good UI: I'll enhance the UI to display the transaction data attractively.



Here's the step-by-step implementation:

Step 1: Transaction History Component

This component will handle fetching the transactions, handling pagination, and displaying the transactions.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css'; // CSS for styling

function TransactionHistory({ userPin }) {
  const [transactions, setTransactions] = useState([]);
  const [pageNumber, setPageNumber] = useState(0); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the transaction history using the userPin and current page
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/api/transactions`, {
          params: { userPin: userPin, page: pageNumber, size: 10 },
        });
        
        const data = response.data;
        setTransactions(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setErrorMessage('Failed to fetch transactions. Please try again later.');
        console.error(error);
      }
    };

    fetchTransactions();
  }, [userPin, pageNumber]);

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div className="transaction-history-container">
      <h2>Recent Transactions</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {transactions.length > 0 ? (
        <>
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="transaction-card">
                <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
                <p><strong>Sender Account:</strong> {transaction.senderAccountNumber || 'N/A'}</p>
                <p><strong>Receiver Account:</strong> {transaction.receiverAccountNumber}</p>
                <p><strong>Date & Time:</strong> {new Date(transaction.transactionDateTime).toLocaleString()}</p>
                <p><strong>Balance After Transfer:</strong> ${transaction.balanceAfterTransfer.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={pageNumber === 0} className="pagination-btn">
              Previous
            </button>
            <span>Page {pageNumber + 1} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={pageNumber === totalPages - 1} className="pagination-btn">
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No transactions found for the given User PIN.</p>
      )}
    </div>
  );
}

export default TransactionHistory;

Step 2: UI for Entering User Pin

This component remains the same, as it allows the user to enter their userPin before showing the transaction history.

import React, { useState } from 'react';
import './TransactionHistory.css'; // Style sheet

function EnterUserPin({ onPinSubmit }) {
  const [userPin, setUserPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userPin) {
      setErrorMessage('Please enter your User PIN');
      return;
    }

    // Pass the userPin to the parent component for API call
    onPinSubmit(userPin);
  };

  return (
    <div className="enter-pin-container">
      <h2>Enter Your User PIN to View Transaction History</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter User PIN"
          value={userPin}
          onChange={(e) => setUserPin(e.target.value)}
          className="input-field"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default EnterUserPin;

Step 3: Combining Both Components

import React, { useState } from 'react';
import EnterUserPin from './EnterUserPin';
import TransactionHistory from './TransactionHistory';

function TransactionsPage() {
  const [userPin, setUserPin] = useState(null);

  const handlePinSubmit = (enteredPin) => {
    setUserPin(enteredPin);
  };

  return (
    <div className="transactions-page">
      {userPin ? (
        <TransactionHistory userPin={userPin} />
      ) : (
        <EnterUserPin onPinSubmit={handlePinSubmit} />
      )}
    </div>
  );
}

export default TransactionsPage;

Step 4: CSS (TransactionHistory.css)

.enter-pin-container, .transaction-history-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.submit-btn {
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #218838;
}

.transaction-list {
  margin-top: 20px;
}

.transaction-card {
  background-color: white;
  padding: 20px;
  margin: 15px 0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.transaction-card p {
  margin: 8px 0;
}

.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

Explanation:

UI for userPin: Users first enter their userPin. If the field is empty, an error is shown.

Transaction List: Once the user enters the correct userPin, the app will fetch and display transactions. If there are no transactions, a message is shown.

Pagination: It will allow the user to navigate through pages of transactions.

Error Handling: Any error in the API request will be caught and displayed.


This solution should offer a clean, intuitive user experience. Let me know if you need further refinements or enhancements!


#-#-#-#-#--#-#-#-#-+#+#+#+#+#+#+#-#-#-#-#--#-#-#-#-#--#-#-#-#---#-#-#-#-#-#-#-#--

  .transaction-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f7;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}

.transaction-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.transaction-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transaction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.transaction-card p {
  margin: 10px 0;
  font-size: 16px;
  color: #555;
}

.transaction-card strong {
  color: #333;
  font-weight: bold;
}

.transaction-card .transaction-id {
  color: #007bff;
  font-size: 14px;
  word-break: break-all;
  font-weight: bold;
}

.pagination-controls {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* Styling for the transaction details */
.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.transaction-details p {
  margin: 0;
}

.transaction-balance {
  color: #28a745;
  font-size: 18px;
  font-weight: bold;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .transaction-card {
    padding: 15px;
  }

  h2 {
    font-size: 24px;
  }

  .pagination-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

<div className="transaction-list">
  {transactions.map((transaction) => (
    <div key={transaction.transactionId} className="transaction-card">
      <p className="transaction-id"><strong>Transaction ID:</strong> {transaction.transactionId}</p>
      <div className="transaction-details">
        <p><strong>Sender:</strong> {transaction.senderAccountNumber || 'N/A'}</p>
        <p><strong>Receiver:</strong> {transaction.receiverAccountNumber}</p>
      </div>
      <div className="transaction-details">
        <p><strong>Date:</strong> {new Date(transaction.transactionDateTime).toLocaleString()}</p>
        <p className="transaction-balance"><strong>Balance:</strong> ${transaction.balanceAfterTransfer.toFixed(2)}</p>
      </div>
    </div>
  ))}
</div>




#-#-#-#-#-#--#-#-#-#-#-#-#-#-#--#-#-#-#-#-*-*-*-
 <div className="transaction-list">
  {transactions.map((transaction) => {
    // Convert transactionDateTime to a JS Date object
    const transactionDate = new Date(transaction.transactionDateTime);
    const date = transactionDate.toLocaleDateString();
    const time = transactionDate.toLocaleTimeString();

    return (
      <div key={transaction.transactionId} className="transaction-card">
        <p className="transaction-id"><strong>Transaction ID:</strong> {transaction.transactionId}</p>
        <div className="transaction-details">
          <p><strong>Sender:</strong> {transaction.senderAccountNumber || 'N/A'}</p>
          <p><strong>Receiver:</strong> {transaction.receiverAccountNumber}</p>
        </div>
        <div className="transaction-details">
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {time}</p>
        </div>
        <div className="transaction-details">
          <p className="transaction-balance"><strong>Balance:</strong> ${transaction.balanceAfterTransfer.toFixed(2)}</p>
        </div>
      </div>
    );
  })}
</div>




#-#-#-#--#-#-#-#-#-#--#-#-#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-#--#-#-#-#-#-#-#--#-#-#-#-#-#-#-#-
  Here's the full code for the Transaction History page, including the separation of date and time, pagination, and the enhanced CSS for a beautiful layout.

Complete React Code for Transaction History

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [userPin, setUserPin] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transactions`, {
        params: {
          userPin: userPin,
          page: page,
        },
      });
      setTransactions(response.data.content);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions. Please check your user PIN.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userPin) {
      fetchTransactionHistory();
    } else {
      setError('Please enter your user PIN.');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (userPin) {
      fetchTransactionHistory();
    }
  }, [page]);

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>

      <form onSubmit={handleSubmit} className="user-pin-form">
        <input
          type="text"
          placeholder="Enter your User PIN"
          value={userPin}
          onChange={(e) => setUserPin(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn">View Transactions</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="transaction-list">
        {transactions.map((transaction) => {
          const transactionDate = new Date(transaction.transactionDateTime);
          const formattedDate = transactionDate.toLocaleDateString();
          const formattedTime = transactionDate.toLocaleTimeString();

          return (
            <div key={transaction.transactionId} className="transaction-card">
              <p className="transaction-id"><strong>Transaction ID:</strong> {transaction.transactionId}</p>
              <div className="transaction-details">
                <p><strong>Sender:</strong> {transaction.senderAccountNumber || 'N/A'}</p>
                <p><strong>Receiver:</strong> {transaction.receiverAccountNumber}</p>
              </div>
              <div className="transaction-details">
                <p><strong>Date:</strong> {formattedDate}</p>
                <p><strong>Time:</strong> {formattedTime}</p>
              </div>
              <p className="transaction-balance"><strong>Balance:</strong> ${transaction.balanceAfterTransfer.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {transactions.length > 0 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;

Complete CSS for Transaction History (TransactionHistory.css)

.transaction-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f7;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.user-pin-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
  width: 250px;
}

.submit-btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

.transaction-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.transaction-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transaction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.transaction-card p {
  margin: 10px 0;
  font-size: 16px;
  color: #555;
}

.transaction-card strong {
  color: #333;
  font-weight: bold;
}

.transaction-card .transaction-id {
  color: #007bff;
  font-size: 14px;
  word-break: break-all;
  font-weight: bold;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin-top: 10px;
}

.transaction-details p {
  margin: 0;
}

.transaction-balance {
  color: #28a745;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.pagination-controls {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

Explanation:

User PIN Form: The form allows the user to enter their userPin and view transactions after submission.

Grid-based Layout: The transactions are displayed in a grid, and each transaction is presented within a card. The grid adjusts for responsiveness using grid-template-columns.

Pagination: There are Previous and Next buttons that allow the user to navigate through pages of transactions. The buttons are disabled when on the first or last page.

Date and Time Split: The transactionDateTime is split into separate Date and Time fields and displayed in a clean and distinct format.


This should provide a visually appealing and functional transaction history page. Let me know if you want to tweak the design further!


