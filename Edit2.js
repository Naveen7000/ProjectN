src/
│
├── components/
│   ├── Login.js
│   ├── Home.js
│   ├── Profile.js
│   ├── Transfer.js
│   ├── MoneyTracking.js
│   ├── Reports.js
│
├── App.js
├── index.js
└── App.css
index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Create a root to render the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Transfer from './components/Transfer';
import MoneyTracking from './components/MoneyTracking';
import Reports from './components/Reports';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/tracking" element={<MoneyTracking />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;


Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importing CSS for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Basic validation (can be extended with proper authentication)
    if (email && password) {
      navigate('/home'); // Redirect to home page after login
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="input-container">
          <input
            type="text"
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
        <button onClick={handleLogin} className="login-btn">Login</button>
      </div>
    </div>
  );
}

export default Login;

Login.css



Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Money Transfer App</h1>
      <nav>
        <Link to="/profile">Profile</Link>
        <Link to="/transfer">Transfer Money</Link>
        <Link to="/tracking">Money Tracking</Link>
        <Link to="/reports">Reports</Link>
      </nav>
    </div>
  );
}

export default Home;

Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Replace with actual user fetch logic
    axios.get('/api/user-profile') // This should be your actual API route
      .then(response => setUser(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Balance:</strong> ${user.balance}</p>
      </div>
    </div>
  );
}

export default Profile;


Transfer.js

import React, { useState } from 'react';
import axios from 'axios';
import './Transfer.css';

function Transfer() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    axios.post('/api/transfer', { senderId, receiverId, amount }) // Replace with actual API
      .then(response => {
        alert('Transfer successful!');
      })
      .catch(err => {
        alert('Transfer failed!');
        console.error(err);
      });
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Money</h2>
      <div>
        <input
          type="text"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default Transfer;


Track.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MoneyTracking.css';

function MoneyTracking() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions') // Replace with actual API
      .then(response => setTransactions(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="tracking-container">
      <h2>Money Tracking</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <p><strong>From:</strong> {transaction.senderId}</p>
            <p><strong>To:</strong> {transaction.receiverId}</p>
            <p><strong>Amount:</strong> ${transaction.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoneyTracking;


Report.js

import React from 'react';
import './Reports.css';

function Reports() {
  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {/* Add reporting logic here */}
      <p>Reports about your transactions and financial summary will be available here.</p>
    </div>
  );
}

export default Reports;

css

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

nav a {
  margin-right: 20px;
  text-decoration: none;
  color: #007BFF;
}

nav a:hover {
  text-decoration: underline;
}

h1, h2 {
  color: #333;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #218838;
}

input {
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
