// RequireAdmin.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './UserContext'

function RequireAdmin({ children }) {
   
    
    const auth = useAuth();
   
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role=localStorage.getItem('role');
    

    if (!auth || role !== 'hosteladmin') {
        // Redirect to unauthorized page if user is not logged in or not a hostel-admin
        return <Navigate to="/unauthorized" />;
    }

    // If user is logged in and is a hostel-admin, allow access to the children components
    return children;
}

export default RequireAdmin;
