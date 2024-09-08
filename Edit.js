src/
|-- components/
|   |-- Login.js
|   |-- Register.js
|   |-- Dashboard.js
|   |-- Transfer.js
|   |-- TransactionHistory.js
|   |-- Profile.js
|-- services/
|   |-- api.js
|-- App.js
|-- index.js

import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/balance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBalance(response.data.balance);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Balance: {balance}</p>
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>{tx.date} - {tx.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import axios from 'axios';

function Transfer() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);

  const handleTransfer = async () => {
    try {
      await axios.post('http://localhost:8080/api/transfer', {
        recipient,
        amount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Transfer successful');
    } catch (error) {
      console.error(error);
      alert('Transfer failed');
    }
  };

  return (
    <div>
      <h2>Transfer</h2>
      <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default Transfer;

import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => API.post('/auth/login', { email, password });
export const register = (name, email, password) => API.post('/auth/register', { name, email, password });
export const getBalance = () => API.get('/user/balance');
export const transferMoney = (recipient, amount) => API.post('/transfer', { recipient, amount });
                                                  

