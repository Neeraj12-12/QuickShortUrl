import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const login = (userId) => {
    setUserId(userId);
    // Optionally store in localStorage or cookies
    localStorage.setItem('userId', userId);
  };

  const logout = () => {
    setUserId(null);
    // Optionally clear from localStorage or cookies
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
