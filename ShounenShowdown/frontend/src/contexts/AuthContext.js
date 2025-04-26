import { createContext, useContext, useState, useEffect } from 'react';

import AuthClient from '../clients/AuthClient.js'

// Create authentication context
const AuthContext = createContext();

// AuthProvider to manage user authentication state
export const AuthProvider = ({ children }) => {
    // user state
    const [user, setUser] = useState(null);
    //loading state
    const [loading, setLoading] = useState(true); // Add loading state

    // Fetch current user on app load
    useEffect(() => {
      AuthClient.current()
          // Set user if JWT is valid
          .then(user => {
            console.log(user);
              setUser(user);
          })
          // Clear user if not authenticated
          .catch(() => {
            setUser(null);
          })
          // Ensure loading state is set to false
          .finally(() => {
            setLoading(false)
          });
    }, []);

    const current = () => {
      AuthClient.current()
      // Set user if JWT is valid
      .then(user => {
          setUser(user);
          console.log(user);
      })
      // Clear user if not authenticated
      .catch(() => {
        logout();
      })
      // Ensure loading state is set to false
      .finally(() => {
        setLoading(false)
      });
    }
  
    // Login function
    const login = (username, password) => {
      return AuthClient.login(username, password)
      .then(logged => {
        setUser(logged);
      })
      .catch(error => {
          throw error;
          // console.log(error.message);
      })
    };
  
    // Logout function
    const logout = () => {
      return AuthClient.logout()
      .then(user => {
        setUser(null);
      })
      .catch(error => {
          throw error;
      })
    };

    // Register function
    const register = (username, email, password, confirmPassword) => {
        return AuthClient.register(username, email, password, confirmPassword)
        .then(user => {
            setUser(null);
        })
        .catch(error => {
            throw error;
            // console.log(error.message);
        })
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, register, current, loading }}>
        {children}
      </AuthContext.Provider>
    );
};

// Custom hook to use authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};