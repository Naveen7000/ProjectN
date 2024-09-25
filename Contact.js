Here's a modern React Contact page with a form for submitting queries and a section for a chatbot. The page has a clean and modern design using Flexbox for layout, and some modern CSS techniques to give it a polished, real-world application look.

React Contact Page Code

// src/components/Contact.js

import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form logic here
    console.log("Form submitted:", formData);
    alert("Thank you for your query! We will get back to you shortly.");
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="form-section">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              required
            />

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>

        <div className="chatbot-section">
          <h2>Chat with Us</h2>
          <div className="chatbot-window">
            {/* Chatbot integration would go here */}
            <p>Our chatbot is ready to help you!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

CSS for Modern Design

/* src/components/Contact.css */

.contact-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.contact-container {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  max-width: 1000px;
  width: 90%;
}

.form-section,
.chatbot-section {
  padding: 40px;
  width: 50%;
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.contact-form label {
  font-family: 'Poppins', sans-serif;
  display: block;
  margin-bottom: 10px;
  color: #555;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #6200ea;
}

.submit-button {
  background-color: #6200ea;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #3700b3;
}

.chatbot-window {
  height: 300px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #666;
  font-family: 'Poppins', sans-serif;
}

.chatbot-section {
  background-color: #f7f7fc;
  border-left: 1px solid #eaeaea;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
  }

  .form-section,
  .chatbot-section {
    width: 100%;
  }
}

Key Features:

1. Responsive Layout: The page is responsive, and it adjusts nicely for mobile view using media queries.


2. Clean and Modern Design: A modern layout with Flexbox, rounded corners, and subtle shadows to give it a sleek appearance.


3. Chatbot Section: There’s a placeholder for integrating a chatbot, which could be connected to any chatbot API.


4. Form Validation: Basic form validation with required fields.


5. Hover Effects: Buttons and inputs have hover effects to enhance user experience.


6. Custom Font: I used 'Poppins', a popular font for modern interfaces, for a clean, minimalist look.



Usage:

1. Create a React app using npx create-react-app.


2. Add the provided Contact.js component and corresponding CSS.


3. Import the Contact component into your App.js or wherever needed.


4. Customize as needed, and integrate the chatbot functionality.



This design ensures a real-world look and feel with a focus on usability and a modern interface. Let me know if you need further customization!

                
