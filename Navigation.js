Here is a React code for a modern, clean, and cool-looking horizontal navigation bar. This design will have a logo on the left, a gap in the middle, and clickable text-based navigation links aligned in a single row on the right. We'll be using plain CSS for styling to keep the design minimal and modern.

React Component (NavBar.js)

import React from 'react';
import './NavBar.css'; // Importing the CSS for styling

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* Add your logo image or text here */}
                <a href="/">MyLogo</a>
            </div>
            <div className="navbar-links">
                <a href="/home" className="nav-link">Home</a>
                <a href="/about" className="nav-link">About</a>
                <a href="/services" className="nav-link">Services</a>
                <a href="/contact" className="nav-link">Contact</a>
            </div>
        </nav>
    );
};

export default NavBar;

CSS (NavBar.css)

/* Basic reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Navbar container */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #282c34;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Logo styling */
.navbar-logo a {
    color: #61dafb;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    letter-spacing: 1px;
}

/* Link container */
.navbar-links {
    display: flex;
    gap: 30px; /* Adds space between links */
}

/* Individual link styling */
.navbar-links .nav-link {
    color: white;
    font-size: 1.1rem;
    text-decoration: none;
    transition: color 0.3s ease;
}

/* Hover effect for links */
.navbar-links .nav-link:hover {
    color: #61dafb; /* Same as logo color for consistency */
}

/* Responsive behavior (optional) */
@media (max-width: 768px) {
    .navbar-links {
        display: none; /* Hides links for smaller screens, you can modify for mobile-friendly */
    }
}

Explanation:

1. navbar container:

Flexbox is used to align the items horizontally (display: flex) and space them out using justify-content: space-between. This ensures the logo is on the left, and the navigation links are on the right.



2. Logo:

The logo is styled to be on the left. It’s a simple text that links back to the homepage (href="/").

You can replace the text "MyLogo" with an image tag if you prefer an image logo.



3. Navigation Links:

The navigation links are plain text links (<a> tags) styled with color: white and a hover effect that changes the color to the same as the logo (#61dafb).

The links are spaced out using gap: 30px to give them a clean, modern feel.



4. Responsive Design (Optional):

There is a basic media query included to hide the navigation links on screens smaller than 768px. You can expand on this by adding a mobile menu (like a hamburger icon).




How to Use:

1. Place the component: You can now import and use the NavBar component in your main app (e.g., App.js):

import React from 'react';
import NavBar from './NavBar'; // Adjust path as needed

function App() {
    return (
        <div className="App">
            <NavBar />
            {/* Other components go



      
