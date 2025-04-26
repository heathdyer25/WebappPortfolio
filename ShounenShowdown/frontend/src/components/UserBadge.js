import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext.js";
import { useUser, UserProvider } from "../contexts/UserContext.js";

const UserBadgeContent = ({ chosenUser})  => {
    const { user } = useAuth();
    const { getUserByUserId } = useUser();
    const [thisUser, setThisUser] = useState(null);

    useEffect(() => {
        if (chosenUser === "current") {
            setThisUser(user);
        } else if (chosenUser === "bot") {
            const randomThreeDigit = Math.floor(100 + Math.random() * 900);
            let bot = {
                username: `bot${randomThreeDigit}`,
            }
            setThisUser(bot);
        } else {
            getUserByUserId(chosenUser).then(userData => {
                setThisUser(userData);
            }).catch(error => {
                console.error("Error fetching user:", error);
            });
        }
    }, []);

    if (!thisUser) return <div>Loading...</div>;

    return (
        <Link to="/profile" >
            <div className="user-badge">
                <img
                    className="profile-img"
                    src={thisUser.avatar 
                        ? `/api/${thisUser.avatar}` 
                        : '/images/profile/default.jpg'}                      
                    alt="Profile" 
                />
                <span id="username">{thisUser.username}</span>
            </div>
        </Link>
    );
};

const UserBadge = React.memo(({chosenUser}) => {
    return (
        <UserProvider>
                <UserBadgeContent chosenUser={chosenUser} />
        </UserProvider>
      );
});

export default UserBadge;