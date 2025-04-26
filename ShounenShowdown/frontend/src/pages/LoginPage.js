// HomePage.js (Page)
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { Link, useNavigate  } from 'react-router-dom';

import Header from '../components/Header.js';

import "../styles/form.css";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [error, setError] = useState("");

  function validateRegistration() {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    let isValid = true;

    //check password validity
    passwordField.setCustomValidity("");
    if (!passwordField.checkValidity()) {
        setLoginAttempt(true);
        setError('Password must be 8-20 characters long. Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.');
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
      login(username, password)
      .then(() => {
        //automatic redirect
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
        {/* {error && <p className="error">{error}</p>} */}
        <form className="container col" id="login" onSubmit={handleSubmit} noValidate>
          <h2>Login</h2>
          {/* {stateVariableName === true and <div></div>} */}
          {
            loginAttempt === true && (
              <div className = "error">
                {error}
              </div>
            )
          }
          <input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="5"
              maxLength="20"
              pattern="^[a-zA-Z][a-zA-Z0-9_]*$"
          />
          <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              maxLength="20"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(_\)=\+\-]).*$"
          />
          <input className="button" type="submit" placeholder="Login"/>
        </form>
        <Link to="/register" className="button">
          <span>Register</span>
        </Link>
      </main>
    </>
  );
}

export default LoginPage;