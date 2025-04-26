import { createContext, useContext, useState } from 'react';
import UserClient from '../clients/UserClient.js';

// Create a user context
const UserContext = createContext();

// UserProvider to manage user data
export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);

    const getUserByUserId = (userId) => {
        return UserClient.getUserByUserId(userId)
            .then(user => {
                setUserDetails(user);
                return user;
            })
            .catch(error => {
                console.error("User not found:", error);
                setUserDetails(null);
                return null;
            });
    };

    return (
        <UserContext.Provider value={{ userDetails, getUserByUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use user context
export const useUser = () => {
    return useContext(UserContext);
};

