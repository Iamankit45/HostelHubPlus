
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
import EditNotice from './Components/Notice/EditNotice';
import AddHostelForm from './Components/Hostel/AddHostel';
import ViewHostelDetails from './Components/Hostel/ViewHostels';
import SpecificHostelDetails from './Components/Hostel/SpecificHostelDetails';
import HostelAllotment from './Components/Hostel/HostelAllotment';
import ManualRoomAllocation from './Components/Hostel/ManualRoomAllocation';
import AssignCaretaker from './Components/Hostel/AssignCaretaker';
import AssignWarden from './Components/Hostel/AssignWarden';
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
          <Route path="/edit-notice/:id" element={<RequireAuth><EditNotice/></RequireAuth>} />
          <Route path="/admin/add-hostel" element={<RequireAuth><AddHostelForm/></RequireAuth>}/>
          <Route path="/admin/view-hostels" element={<RequireAuth><ViewHostelDetails /></RequireAuth>}/>
          
          <Route path="/view-hostels/:id" element={<RequireAuth><SpecificHostelDetails/></RequireAuth>}/>
          <Route path="/admin/hostel-allotment" element={<RequireAuth><HostelAllotment/></RequireAuth>}/>
          <Route path ="/hostel/:id/manual-allocation" element={<RequireAuth><ManualRoomAllocation/></RequireAuth>}/>
          <Route path="/hostel/assign-caretaker" element={<RequireAuth><AssignCaretaker/></RequireAuth>}/>
          <Route path="/hostel/assign-warden" element={<RequireAuth><AssignWarden/></RequireAuth>}/>
          <Route path="/" element={<HomePage />} />
        </Routes>
        </NoticeProvider>
       
      </UserProvider>
      
    
     
    

  );
}

export default App;
