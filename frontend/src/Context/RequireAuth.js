import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import {useAuth} from './UserContext'

function RequireAuth({children}) {

    const auth = useAuth();
    const location = useLocation();
    const token= localStorage.getItem('token');
  //  console.log(auth);
    if(!token)
    {
        return(<Navigate to="/login" state={{path : location.pathname}}/> );
    }
  return (children);
}

export default RequireAuth
