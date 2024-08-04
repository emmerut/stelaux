import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from "@/constant/sessions"

const useAuthentication = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Function to handle user logout
  const logout = () => {
    deleteCookie('user_token');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/auth/login'); // Redirect to login page
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie('user_token');
    
      // Check for token presence and validity
      if (token) {
        try {
          const res = await fetch('http://127.0.0.1:8000/v1/users/user_all_data/', { // Replace with your token verification endpoint
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const userData = await res.json();
            setIsAuthenticated(true);
            setUserData(userData);
          } else {
            // Token is invalid, handle accordingly (e.g., logout user)
            logout(); 
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          // Handle errors gracefully, potentially log the user out
          logout();
        }
      } else {
        navigate('/auth/login');
      }
    };

    fetchData();
  }, [navigate]); // Only run on mount and when 'navigate' changes

  return { isAuthenticated, userData, setIsAuthenticated, logout };
};

export default useAuthentication; 