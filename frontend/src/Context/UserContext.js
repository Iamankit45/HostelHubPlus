// UserContext.js
import React, { createContext, useState ,useEffect} from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user information from local storage
    const storedUser = {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role')
    };
    setUser(storedUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
