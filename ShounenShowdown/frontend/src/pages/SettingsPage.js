// HomePage.js (Page)
import React, {useEffect, useState, useRef} from 'react';

import Header from '../components/Header.js';
import { useAuth} from "../contexts/AuthContext.js";

import '../styles/form.css';
import BackArrow from '../components/BackArrow.js';

import UserClient from '../clients/UserClient.js';

const SettingsPage = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [menu, setMenu] = useState(0);
  const { user, logout, current } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const profilePhotoRef = useRef(null);

  useEffect(() => {
    switch (menu) {
        case 0:
            displayUsernameMenu();
            break;
        case 1:
            displayEmailMenu();
            break;
        case 2:
            displayPasswordMenu();
            break;
    };
  }, [menu]);


  const handleSubmit = (event) => {
    event.preventDefault();
    switch (menu) {
        //handle username update
        case 0:
            UserClient.updateUserSettings(user.id, currentPassword, username, null, null, null).then(result => {
                current();
                setError(null);
                setSuccess(result.message);
            })
            .catch(error => {
                setSuccess(null);
                setError(error.message);
            })
            break;
        //handle email update
        case 1:
            UserClient.updateUserSettings(user.id, currentPassword, null, email, null, null).then(result => {
                current();
                setError(null);
                setSuccess(result.message);
            })
            .catch(error => {
                setSuccess(null);
                setError(error.message);
            })
            break;
        //handle password update
        case 2:
            UserClient.updateUserSettings(user.id, currentPassword, null, null, newPassword, confirmPassword).then(result => {
                current();
                setError(null);
                setSuccess(result.message);
            })
            .catch(error => {
                setSuccess(null);
                setError(error.message);
            })
            break;
    };
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const setVisible = (elementRef) => {
    elementRef.current.style.display = 'block';
  };

  const setInvisible = (elementRef) => {
    elementRef.current.style.display = 'none';
  }

  const displayUsernameMenu = () => {
    setVisible(usernameRef);
    setInvisible(emailRef);
    setInvisible(newPasswordRef);
    setInvisible(confirmPasswordRef);
  }

  const displayEmailMenu = () => {
    setInvisible(usernameRef);
    setVisible(emailRef);
    setInvisible(newPasswordRef);
    setInvisible(confirmPasswordRef);
  }

  const displayPasswordMenu = () => {
    setInvisible(usernameRef);
    setInvisible(emailRef);
    setVisible(newPasswordRef);
    setVisible(confirmPasswordRef);
  }

  const updatePhoto = () => {
    const formData = new FormData();
    formData.append('avatar', profilePhoto);

    fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        current();
        setError(null);
        setProfilePhoto(null);
        setSuccess(result.message);
    })
    .catch(error => {
        setSuccess(null);
        setError(error.message);
    });
  }

//   function validateRegistration() {
//     const usernameField = document.getElementById('username');
//     const passwordField = document.getElementById('password');

//     let isValid = true;

//     //check password validity
//     passwordField.setCustomValidity("");
//     if (!passwordField.checkValidity()) {
//         setLoginAttempt(true);
//         setError('Password must be 8-20 characters long. Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.');
//         isValid = false;
//     }

//     //check username validity
//     usernameField.setCustomValidity("");
//     if (!usernameField.checkValidity()) {
//         setLoginAttempt(true);
//         setError('Username must 5 - 20 characters long. Username can only contain letters, numbers, and underscores.');
//         isValid = false;
//     }

//     return isValid;
//   }


  return (
    <>
      <Header />
      <BackArrow />
      <main>
        {/* <!-- Username and email --> */}
        <form onSubmit={handleSubmit}>
            {/* <!-- Username and email --> */}
            <div className="col">
                <h1 id="username">{ user.username }</h1>
            </div>
                {/* <!-- Profile Image --> */}
            <label className="row" id="profile-photo-label" htmlFor="profile-photo">
                <img id="profile-img" className="graphic profile-img img-upload" src={profilePhoto ? URL.createObjectURL(profilePhoto) : (`/api/${user.avatar || 'uploads/avatars/default.jpg'}`)} alt="Profile Photo"/>
            </label>
            {/* <!-- File Input --> */}
            <input type="file" id="profile-photo" name="profile-photo" accept="image/*" onChange={handleFileChange} ref={profilePhotoRef}/>
            
            {/* <!-- Username and email --> */}
            <div className="col">
                <h3 id="email">{ user.email }</h3>
            </div>

            {/* Show if profile photo is selected */}
            { profilePhoto && ( <div className="row">
                <button className="button" onClick={updatePhoto} id="updatePhoto">
                    <span>Update Avatar</span>
                </button>
            </div>)

            }
            <div className="row settings-menu">
                <p className="settings-menu-item" onClick={() => setMenu(0)}>Update Username</p>
                <p className="settings-menu-item" onClick={() => setMenu(1)}>Update Email</p>
                <p className="settings-menu-item" onClick={() => setMenu(2)}>Update Password</p>
            </div>
            <div className="container col">
                {
                    error && (
                    <div className = "error">
                        {error}
                    </div>
                    )
                }
                {
                    success && (
                    <div className = "success">
                        {success}
                    </div>
                    )
                }
                <input id="current-password" type="password" name="current-password" placeholder="Current Password" onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    minLength="8"
                    maxLength="20"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(_\)=\+\-]).*$"/>
                <input id="username" type="text" name="username" placeholder="Username" ref={usernameRef} onChange={(e) => setUsername(e.target.value)}
                    minLength="5"
                    maxLength="20"
                    pattern="^[a-zA-Z][a-zA-Z0-9_]*$"/>
                <input id="email" type="text" name="email" placeholder="Email"  ref={emailRef} onChange={(e) => setEmail(e.target.value)}
                    pattern="^[^@]+@[^@]+\.[^@]+$"/>
                <input id="new-password" type="password" name="new-password" placeholder="New Password"  ref={newPasswordRef} onChange={(e) => setNewPassword(e.target.value)}
                    minLength="8"
                    maxLength="20"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(_\)=\+\-]).*$"/>
                <input id="confirm-password" type="password" name="confirm-password" placeholder="Confirm Password" ref={confirmPasswordRef} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <input className="button" type="submit" value="Update Settings"/>
            </div>
        </form>
        {/* Logout Button */}
        {user && (
        <button onClick={logout} id="logout" className="button">
            <span>Logout</span>
        </button>
        )}
      </main>
    </>
  );
}

export default SettingsPage;