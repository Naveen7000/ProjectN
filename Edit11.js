To create a navigation tab for the user to navigate between the Home page and Transaction History page, you can create a Navbar component and ensure it fits well with your existing design. Below is the complete implementation including the navigation tab code in React and the corresponding CSS.

Step 1: Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>MoneyFlow</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/transaction-history" className="nav-link">Transaction History</Link>
        </li>
        <li>
          <Link to="/transfer" className="nav-link">Transfer Money</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

Step 2: Update Routing

Ensure that you have routing setup in your React application to handle different pages (Home, Transaction History, and Transfer). Here's an example of how you can set it up:

App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './HomePage'; // Your home page component
import Transfer from './Transfer'; // Your transfer page component
import TransactionHistory from './TransactionHistory'; // Transaction history component
import Navbar from './Navbar'; // The Navbar component

function App() {
  return (
    <Router>
      <Navbar /> {/* Always display the Navbar */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  );
}

export default App;

Step 3: Create CSS for the Navbar

Here's the CSS to make the navbar look appealing and responsive.

Navbar.css

/* Navbar styling */
.navbar {
  background-color: #4CAF50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navbar-logo h2 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.navbar-links {
  list-style-type: none;
  display: flex;
  gap: 20px;
  margin: 0;
}

.navbar-links li {
  display: inline;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 18px;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #45a049;
}

.nav-link:active {
  background-color: #3e8e41;
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .navbar-links {
    flex-direction: column;
    align-items: center;
  }

  .nav-link {
    padding: 10px;
    font-size: 20px;
  }
}

Step 4: TransactionHistory.js (Sample Transaction History Page)

Here's a basic structure for the Transaction History page. You can expand it as per your requirement.

import React from 'react';
import './TransactionHistory.css'; // For additional styling

function TransactionHistory() {
  const transactions = [
    { id: 1, date: '2024-09-18', amount: 500, receiver: 'John Doe', status: 'Successful' },
    { id: 2, date: '2024-09-17', amount: 200, receiver: 'Jane Smith', status: 'Failed' },
    { id: 3, date: '2024-09-16', amount: 1000, receiver: 'Alice Brown', status: 'Successful' },
  ];

  return (
    <div className="transaction-history-container">
      <h2>Your Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Receiver</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.receiver}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;

Step 5: CSS for TransactionHistory.css

Here’s some basic styling for the transaction history table.

.transaction-history-container {
  padding: 20px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transaction-table th, .transaction-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.transaction-table th {
  background-color: #4CAF50;
  color: white;
}

.transaction-table tr:hover {
  background-color: #f1f1f1;
}

.transaction-table td {
  font-size: 16px;
}

Explanation:

Navbar:

The Navbar component provides links to the Home page, Transaction History page, and the Transfer page.

It uses react-router-dom's Link component to handle client-side navigation without reloading the page.

The CSS styling (Navbar.css) ensures the navigation bar is visually appealing, with hover effects and a responsive design.


App:

The Router component wraps the application and allows navigation between different components using the defined Routes.

Each page (Home, Transaction History, and Transfer) has its own route.


Transaction History Page:

Displays a simple table showing mock transaction history data.

You can replace the mock data with actual transaction data fetched from your backend.



Step 6: Testing

Ensure your React Router setup is correct and the navigation works without reloading the page.

The navbar should appear consistently across all pages and allow navigation to the Home page, Transfer page, and Transaction History page.


