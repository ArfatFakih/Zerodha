// components/AuthProvider.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check localStorage first
        const user = localStorage.getItem('user');
        if (!user) {
          throw new Error('No user data in localStorage');
        }

        // Verify with backend
        const response = await axios.get(
          'https://zerodha-9zmu.onrender.com/verify-session',
          { withCredentials: true }
        );

        if (response.data.authenticated) {
          setIsAuthenticated(true);
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          throw new Error('Session not authenticated');
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setIsAuthenticated(false);
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = 'https://zerodha-b03g67fs6-arfat-fakihs-projects.vercel.app/';
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;