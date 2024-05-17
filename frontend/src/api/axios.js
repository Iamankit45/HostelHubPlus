import axios from 'axios';
import { BASE_URL } from '../services/helper';
import { useAuth } from './../Context/UserContext';


// /Users/ANKIT KUMAR/Desktop/Taste_on_way/frontend/src/api/axios.js
const BaseUrl = `${BASE_URL}/api/v1`

export const API = axios.create({ baseURL: BaseUrl });

export const PrivateAPI = axios.create({
  baseURL: BaseUrl,
  headers: { 'content-type': 'application/json' },
  withCredentials: true
});



export const checkEmailUsername = (emailUsername) => API.post('users/checkPassAndUserID', emailUsername);


// Modified login function to extract username and role from response
export const login = async (formData) => {
  try {
    const response = await API.post('/login', formData, { withCredentials: true });
    const { username, token, role ,hostelId} = response.data;
    return { username, token, role,hostelId }; // Return username, token, and role
  } catch (error) {
    throw error; // Throw error if login fails
  }
};

export const signup = (formData) => API.post('users/signup', formData, { withCredentials: true });
export const logout = (setUser) => API.delete('/logout', { withCredentials: true }).then(() => {
  localStorage.clear();
  setUser(null);
})

