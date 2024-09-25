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




#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-



  To give the Contact Us page an even more modern look and fix the issues like:

1. Clearing the form fields after submission.


2. Displaying a submission confirmation message within the page (instead of an alert).


3. Adding a chatbot interface with a visual representation of a chatbot icon and a chat window.



I’ll enhance the code by:

Adding a confirmation message below the form after successful submission.

Creating a chatbot container with an animated chat window and bot icon.

Clearing the form fields after submission.


Let’s upgrade the React code with these enhancements.

Upgraded React Contact Page

Contact.js

import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Display the submission message
    setSubmitted(true);
    // Clear form fields
    setFormData({
      name: "",
      email: "",
      message: "",
    });
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

          {/* Display a thank you message upon form submission */}
          {submitted && (
            <div className="submission-message">
              <p>Thank you for your query! We will get back to you shortly.</p>
            </div>
          )}
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-section">
          <h2>Chat with Us</h2>
          <div className="chatbot-window">
            <div className="chatbot-header">
              <img
                src="https://img.icons8.com/clouds/100/000000/chatbot.png"
                alt="Chatbot"
                className="chatbot-icon"
              />
              <span>Chat Bot</span>
            </div>
            <div className="chatbot-body">
              <div className="chatbot-message bot-message">
                Hi! How can I assist you today?
              </div>
              <div className="chatbot-message user-message">
                <span>Type your message...</span>
              </div>
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask your question..."
                className="chatbot-text-input"
              />
              <button className="chatbot-send-button">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

Updated CSS for Modern Design

/* src/components/Contact.css */

.contact-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
}

.contact-container {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  max-width: 1000px;
  width: 100%;
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

/* Submission message styling */
.submission-message {
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;
  color: #28a745;
}

/* Chatbot styling */
.chatbot-section {
  background-color: #f7f7fc;
  border-left: 1px solid #eaeaea;
}

.chatbot-window {
  height: 400px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chatbot-header {
  display: flex;
  align-items: center;
  background-color: #6200ea;
  color: #fff;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}

.chatbot-header .chatbot-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.chatbot-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chatbot-message {
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 15px;
  font-family: 'Poppins', sans-serif;
}

.bot-message {
  background-color: #6200ea;
  color: #fff;
  align-self: flex-start;
}

.user-message {
  background-color: #eaeaea;
  color: #333;
  align-self: flex-end;
}

.chatbot-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #eaeaea;
  border-radius: 0 0 8px 8px;
}

.chatbot-text-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 10px;
  font-family: 'Poppins', sans-serif;
}

.chatbot-send-button {
  padding: 10px 15px;
  background-color: #6200ea;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.chatbot-send-button:hover {
  background-color: #3700b3;
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

New Features and Upgrades:

1. Submission Confirmation Message: After form submission, a confirmation message appears below the form, informing the user that the submission was successful.


2. Clearing Form Fields: The form fields are cleared after successful submission.


3. Chatbot Design:

Bot Icon: Added a chatbot icon in the header of the chatbot window.

Chat Window: A simple visual representation of a chat with bot messages and user input.

Message Input: The user can type in a question and click "Send" (though it's not connected to an actual bot).



4. Modern Styling: The chatbot window has a more realistic chat interface with different message bubbles for bot and user messages.


5. Responsive Design: The layout adjusts to mobile devices by stacking the form and chatbot sections vertically.



This approach ensures that the Contact Us page has a real-world, modern look with interactive elements like a chatbot. Let me know if

                  

                
