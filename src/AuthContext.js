import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (userId) => {
    localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
    setUserId(userId);

    // Fetch user details to determine if the user is an admin
    axios.get(`http://localhost:3000/api/users/${userId}`)
      .then(response => {
        setIsAdmin(response.data.email === 'admin@admin.com');
      })
      .catch(error => {
        console.error("Error fetching user information:", error);
      });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);

      // Fetch user details to determine if the user is an admin
      axios.get(`http://localhost:3000/api/users/${storedUserId}`)
        .then(response => {
          setIsAdmin(response.data.email === 'admin@admin.com');
        })
        .catch(error => {
          console.error("Error fetching user information:", error);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
