
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Header from "./Components/Headers/navbar";
import ViewRoom from "./Components/ViewRoom";
import HomePage from "./Components/Home";
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';

import './App.css';

function App() {
  return (
    <>
      <UserProvider>
        <Header />
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route path="view-rooms" element={<ViewRoom />} />
          <Route path="/" element={<HomePage />} />


        </Routes>
        </UserProvider>
     
    </>

  );
}

export default App;
