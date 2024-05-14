
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Header from "./Components/Headers/navbar";
import ViewRoom from "./Components/ViewRoom";
import HomePage from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import RequireAuth from './Context/RequireAuth';
import { NoticeProvider } from './Context/NoticeContext';
import Notice from './Components/Notice/Notice';
import NoticeForm from './Components/Notice/NoticeForm';


import './App.css';

function App() {
  return (
    
    
      <UserProvider>
      
        <Header />
        
        <NoticeProvider>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/view-rooms" element={<ViewRoom />} />
          <Route path="/notice" element={<RequireAuth><Notice /></RequireAuth>} />
          <Route path="/create-notice" element ={<RequireAuth><NoticeForm/></RequireAuth>}/>
          <Route path="/" element={<HomePage />} />
        </Routes>
        </NoticeProvider>
       
      </UserProvider>
      
    
     
    

  );
}

export default App;
