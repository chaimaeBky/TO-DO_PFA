// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userEmail'); // Check if the user is logged in

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  return children;  // If authenticated, render the child components (HomePage, TaskPage, etc.)
};

export default PrivateRoute;
