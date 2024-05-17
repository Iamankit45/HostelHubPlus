// RequireNotStudent.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './UserContext';

function RequireNotStudent({ children }) {
    const auth = useAuth();
   
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role=localStorage.getItem('role');
 

  if (auth && role === 'student') {
    // If the user is a student, redirect them to the dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default RequireNotStudent;
