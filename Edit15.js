Looking at the code you've shared for App.js, it appears to define routes for your application. Based on your previous issue about navigating to the home page without logging in, there is no authentication check in the current routing structure. This means any user can directly access the routes (/home, /profile, etc.) without being authenticated.

How to Fix It

You should protect the routes that require authentication (like /home, /profile, etc.) by checking whether the user is logged in. A common way to achieve this in React is by using Protected Routes or wrapping certain routes in a condition that checks for authentication before allowing access.

Example: Using Protected Routes

Here's how you can modify the code to include a ProtectedRoute component to restrict access:

1. Create a ProtectedRoute Component: This component will check if a user is authenticated before rendering the appropriate route.

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
};


2. Update Your App.js: Use the ProtectedRoute component to guard the routes that should only be accessible to logged-in users.

import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Profile from './Profile';
import Transfer from './Transfer';
import TransactionHistory from './TransactionHistory';
import Reports from './Reports';

function App() {
    const isAuthenticated = /* logic to check if the user is authenticated, e.g., checking session or token */;

    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Home />} />} />
                <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Profile />} />} />
                <Route path="/transfer" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Transfer />} />} />
                <Route path="/tracking" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<TransactionHistory />} />} />
                <Route path="/reports" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Reports />} />} />
            </Routes>
        </div>
    );
}

export default App;



Explanation:

The ProtectedRoute checks if the user is authenticated using isAuthenticated. If the user is not authenticated, it redirects them to the login page ("/").

You need to implement the logic to determine isAuthenticated, which could be checking for a token in local storage, cookies, or session data.


Example of Authentication Logic:

If you're using a token-based system (like JWT), you can do something like this:

const isAuthenticated = () => {
   return !!localStorage.getItem('authToken'); // Assuming 'authToken' is your authentication token
};

Conclusion:

This will prevent users from accessing pages like /home or /profile without being logged in. If they try to navigate to these pages without authentication, they will be redirected back to the login page.

