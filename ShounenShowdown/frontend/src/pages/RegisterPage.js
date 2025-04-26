// HomePage.js (Page)
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { Link, useNavigate  } from 'react-router-dom';

import Header from '../components/Header.js';

import "../styles/form.css";

const RegisterPage = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [error, setError] = useState("");

  function validateRegistration() {
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');

    let isValid = true;
    
    //check confirmPassword validity
    confirmPasswordField.setCustomValidity("");
    if (password !== confirmPassword) {
        setLoginAttempt(true);
        setError('Passwords must match.');
        isValid = false;
    }

    //check password validity
    passwordField.setCustomValidity("");
    if (!passwordField.checkValidity()) {
        setLoginAttempt(true);
        setError('Password must be 8-20 characters long. Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.');
        isValid = false;
    }

    //check email validity
    emailField.setCustomValidity("");
    if (!emailField.checkValidity()) {
        setLoginAttempt(true);
        setError('Email must be in valid format.');
        isValid = false;
    }

    //check username validity
    usernameField.setCustomValidity("");
    if (!usernameField.checkValidity()) {
        setLoginAttempt(true);
        setError('Username must 5 - 20 characters long. Username can only contain letters, numbers, and underscores.');
        isValid = false;
    }

    return isValid;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateRegistration()) {
      register(username, email, password, confirmPassword)
      .then(() => {
        navigate("/login");
      })
      .catch(error => {
        setLoginAttempt(true);
        setError(error.message);
      });
    }
  };

  return (
    <>
      <Header />

      <main>
        <form id="register" className="container col" noValidate onSubmit = {handleSubmit}>
          <h2>Register</h2>
          {
            loginAttempt === true && (
              <div className = "error">
                {error}
              </div>
            )
          }
          <input id="username" type="text" name="username" placeholder="Username" required minLength="5" maxLength="20" pattern="^[a-zA-Z][a-zA-Z0-9_]*$" onChange={(e) => setUsername(e.target.value)} />
          <input id="email" type="text" name="email" placeholder="Email" required pattern="^[^@]+@[^@]+\.[^@]+$" onChange={(e) => setEmail(e.target.value)} />
          <input id="password" type="password" name="password" placeholder="Password" required minLength="8" maxLength="20" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(_\)=\+\-]).*$" onChange={(e) => setPassword(e.target.value)} />
          <input id="confirm-password" type="password" name="confirm-password" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
          <input className="button" type="submit" value="Register" />
        </form>

        <Link to="/login" className="button">
          <span>Login</span>
        </Link>
      </main>
    </>
  );
}

export default RegisterPage;