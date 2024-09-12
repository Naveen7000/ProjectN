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




Back-end 

1. package com.example.moneytransfer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MoneyTransferApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoneyTransferApplication.class, args);
    }
}

2.package com.example.moneytransfer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String password;

    // Constructors, Getters, and Setters
  }

3.package com.example.moneytransfer.repository;

import com.example.moneytransfer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}

4.package com.example.moneytransfer.service;

import com.example.moneytransfer.model.User;
import com.example.moneytransfer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    public void registerUser(String email, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(email, encodedPassword);
        userRepository.save(user);
    }
}


5.package com.example.moneytransfer.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
      }

6.package com.example.moneytransfer.controller;

import com.example.moneytransfer.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        boolean authenticated = authService.authenticate(email, password);
        if (authenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String email, @RequestParam String password) {
        authService.registerUser(email, password);
        return ResponseEntity.ok("User registered successfully");
    }
                                       }
7. 
spring.data.mongodb.uri=mongodb://localhost:27017/moneytransferdb
server.port=8080

8.
  
plugins {
    id 'org.springframework.boot' version '3.1.1'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'java'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.security:spring
    implementation 'org.springframework.security:spring-security-crypto'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}

9.

money-transfer-app/
├── build.gradle
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── moneytransfer
│   │   │               ├── MoneyTransferApplication.java  # Main Spring Boot Application
│   │   │               ├── model
│   │   │               │   └── User.java                  # User Model for MongoDB
│   │   │               ├── repository
│   │   │               │   └── UserRepository.java        # MongoDB Repository for Users
│   │   │               ├── service
│   │   │               │   └── AuthService.java           # Business Logic for Authentication
│   │   │               ├── controller
│   │   │               │   └── AuthController.java        # API Controller for Login/Register
│   │   │               └── security
│   │   │                   └── PasswordConfig.java        # Password Encryption Config
│   │   └── resources
│   │       └── application.properties                     # Application Configuration
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── moneytransfer
│                       └── MoneyTransferApplicationTests.java # Test Cases



package com.example.moneytransfer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // This annotation marks the class as a MongoDB document
public class User {
    
    @Id // This annotation marks the id field as the unique identifier
    private String id;
    
    private String email;
    private String password;

    // Default Constructor
    public User() {
    }

    // Parameterized Constructor
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ToString method to output the user info in a readable format
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
