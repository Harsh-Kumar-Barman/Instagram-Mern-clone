// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get('/api/auth/isLoggedIn');
//         if (res.status === 200) {
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         setIsAuthenticated(false);
//         console.log('Error during authentication check:', error.message);
//       }
//     };

//     checkAuth();
//   }, []);

//   // While waiting for authentication check
//   if (isAuthenticated === null) return <div>Loading...</div>;

//   // If authenticated, render the child components
//   if (isAuthenticated) return children;

//   // If not authenticated, redirect to login
//   return <Navigate to="/login" />;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Retrieve the stored user information from localStorage
  const storedData = localStorage.getItem('user-info');
  // Parse the data to extract the token (if it exists)
  const token = storedData ? JSON.parse(storedData).token : null;

  // If a token exists, render the children (protected content)
  if (token) {
    return children;
  }

  // Otherwise, redirect to the login page
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
