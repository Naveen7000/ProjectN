To display user details on the home page after a successful login using JWT, you need to:

1. Extract the JWT token from the frontend (e.g., React, Angular) and send it in the Authorization header for each subsequent request to the backend.


2. Create an API endpoint in the backend that returns user details.


3. Decode the JWT token on the backend to retrieve the user information, and send it back as a response.



Here's the code to achieve this:


---

Step 1: Modify the backend to get user details

Add a new endpoint to return user details from the JWT token.

MoneyFlowController.java

package com.example.moneyflow.controller;

import com.example.moneyflow.model.User;
import com.example.moneyflow.repos.UserRepository;
import com.example.moneyflow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class MoneyFlowController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Add this endpoint to return user details
    @GetMapping("/details")
    public ResponseEntity<User> getUserDetails(Authentication authentication) {
        // Get the current authenticated user ID from the token
        String userId = authentication.getName();

        // Retrieve user details from the repository using the userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return ResponseEntity.ok(user);
    }
}

Explanation:

authentication.getName() gets the userId from the authenticated token.

The user details are fetched from the database using userRepository.findById(userId) and returned as a response.




---

Step 2: Call the API from the frontend to get user details

Once the user logs in, and you have the JWT token, send it in the Authorization header to the /api/user/details endpoint.

Here's an example using React for frontend:

HomePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Assuming the JWT token is stored in localStorage after login
        const token = localStorage.getItem('jwtToken');

        if (token) {
            // Make a request to get the user details
            axios.get('http://localhost:8080/api/user/details', {
                headers: {
                    Authorization: `Bearer ${token}`  // Attach the token
                }
            })
            .then(response => {
                setUserDetails(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching user details!", error);
            });
        }
    }, []);

    if (!userDetails) {
        return <div>Loading user details...</div>;
    }

    return (
        <div>
            <h1>Welcome, {userDetails.firstName} {userDetails.lastName}!</h1>
            <p>Email: {userDetails.email}</p>
            <p>User ID: {userDetails.userId}</p>
            {/* Display more user details if necessary */}
        </div>
    );
};

export default HomePage;

Explanation:

On page load, we make an API call to http://localhost:8080/api/user/details with the JWT token in the Authorization header.

The response (user details) is stored in the state and displayed on the page.




---

Step 3: Update your Security Configuration (optional)

If you need to ensure only authenticated users can access the /api/user/details endpoint, make sure your SecurityConfig.java is set up correctly.

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/user/register", "/api/user/login").permitAll()  // Allow public access
            .requestMatchers("/api/user/details").authenticated()  // Secured endpoint
            .anyRequest().authenticated()  // Secure everything else
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
}


---

Step 4: Frontend login (to get JWT token)

If you haven’t already implemented the login flow in your frontend, you can follow this pattern:

LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', {
                userId,
                password
            });

            // Save JWT token to localStorage
            localStorage.setItem('jwtToken', response.data);

            // Redirect to the home page
            window.location.href = '/home';
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;

Explanation:

The login form collects the userId and password.

On successful login, the JWT token is saved in localStorage.

After login, the user is redirected to the home page (/home), where you can fetch the user details.




---

Conclusion

Backend: The /api/user/details endpoint is protected and uses the JWT token to authenticate and fetch user details.

Frontend: Once the user logs in and obtains a JWT token, the token is stored and used to fetch user details from the backend on the home page.


This ensures that after the user logs in, their details can be displayed on the home page by validating the JWT

