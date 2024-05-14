import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/helper';
import { PrivateAPI } from "../../api/axios";
import { useAuth } from "../../Context/UserContext";

const useAxiosPrivate = () => {
  // State variable to store the private API instance
//   const [privateApi, setPrivateApi] = useState(null);
  const { user } = useAuth();

  

  // Effect to set up the private API instance on component mount
  useEffect(() => {
    // Create a new instance of Axios with default configuration options
    // const apiInstance = axios.create({
    //   // Base URL for your private backend API
    //   baseURL: 'http://localhost:4000/',
    //   // Additional default headers
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    // Add an interceptor to include the authorization header
    PrivateAPI.interceptors.request.use(
      (config) => {
        // Retrieve the authentication token from local storage or state
        const authToken = localStorage.getItem('token');
        
        // If a token exists, add it to the authorization header
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
       
        return config;
      },
      (error) => {
        // Handle any errors that occur during the request
        return Promise.reject(error);
      }
    );

    // Set the private API instance in state
    // setPrivateApi(apiInstance);
    
  }, []);

  // Return the private API instance
  return PrivateAPI
};

export default useAxiosPrivate;
