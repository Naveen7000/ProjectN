Here's a React code snippet for a horizontal navigation bar with unique and modern styling using CSS. The design includes smooth hover effects, a slight animation, and a modern look for the text links.

React Code (App.js):

import React from "react";
import './App.css';

function App() {
  return (
    <header>
      <nav className="navbar">
        <div className="nav-logo">
          <a href="#">Brand</a>
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default App;

CSS Code (App.css):

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f4f4f9;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #111;
  padding: 1.5rem 3rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}

.nav-logo a {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.nav-logo a:hover {
  color: #ff4d5a;
  transform: scale(1.1);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2.5rem;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  color: #fff;
  font-size: 1.1rem;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s ease, letter-spacing 0.3s ease;
  letter-spacing: 1px;
}

.nav-links a:hover {
  color: #ff4d5a;
  letter-spacing: 2px;
}

/* Add underline animation */
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background-color: #ff4d5a;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease;
}

.nav-links a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-logo a {
    margin-bottom: 1rem;
  }
}

Key Points of the Design:

1. Modern Font and Layout: The font is clean and professional (Poppins). The layout uses flexbox for easy alignment and space distribution.


2. Logo Animation: The logo has a subtle hover effect that scales up and changes color for a modern feel.


3. Hover Effects: The nav links have hover animations with smooth transitions. They use an underline that slides in from right to left when hovered.


4. Spacing and Alignment: The gap between links ensures proper spacing, while the box-shadow adds a modern, floating effect to the navbar.


5. Responsiveness: The navbar adapts to smaller screens using media queries to stack the links vertically.



How to Use:

1. Create a new React project using create-react-app.


2. Replace the content in App.js with the provided React code.


3. Add the provided CSS in App.css.


4. Install the font 'Poppins' through Google Fonts or include it in your index.html.



This approach should give you a professional, modern navigation bar with clean interactions and responsiveness.

