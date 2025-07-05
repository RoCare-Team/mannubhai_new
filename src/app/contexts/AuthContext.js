"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = () => {
    if (typeof window !== 'undefined') {
      try {
        const userToken = localStorage.getItem('userToken');
        const userPhone = localStorage.getItem('userPhone');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const customerId = localStorage.getItem('customer_id');

        const loggedIn = !!userToken;
        setIsLoggedIn(loggedIn);

        if (loggedIn && customerId) {
          setUserInfo({
            phone: userPhone,
            name: userName || 'Customer',
            email: userEmail || '',
            id: customerId,
          });
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('customer_id');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  useEffect(() => {
    checkLoginStatus();
    
    // Listen for storage changes to sync login state across tabs
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        isLoading,
        checkLoginStatus,
        handleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);