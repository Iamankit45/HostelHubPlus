
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Header from "./Components/Headers/navbar";
import ViewRoom from "./Components/ViewRoom";
import HomePage from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import RequireAuth from './Context/RequireAuth';
import RequireAdmin from './Context/RequireAdmin';
import RequireNotStudent from './Context/RequireNotStudent';
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
import Unauthorized from './Components/Unauthorized';
import ViewStudentInfo from './Components/Student/StudentInfo';
import MarkAttendance from './Components/Student/MarkAttendance';
import StudentDashboard from './Components/Student/StudentDashboard';

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
          <Route path="/create-notice" element ={<RequireAuth><RequireNotStudent><NoticeForm/></RequireNotStudent></RequireAuth>}/>
          <Route path="/edit-notice/:id" element={<RequireAuth><RequireNotStudent><EditNotice/></RequireNotStudent></RequireAuth>} />
          <Route path="/admin/add-hostel" element={<RequireAuth><RequireAdmin><AddHostelForm/></RequireAdmin></RequireAuth>}/>
          <Route path="/admin/view-hostels" element={<RequireAuth><RequireAdmin><ViewHostelDetails /></RequireAdmin></RequireAuth>}/>
          
          <Route path="/view-hostels/:id" element={<RequireAuth><RequireNotStudent><SpecificHostelDetails/></RequireNotStudent></RequireAuth>}/>
          <Route path="/admin/hostel-allotment" element={<RequireAuth><RequireAdmin><HostelAllotment/></RequireAdmin></RequireAuth>}/>
          <Route path ="/hostel/:id/manual-allocation" element={<RequireAuth><RequireNotStudent><ManualRoomAllocation/></RequireNotStudent></RequireAuth>}/>
          <Route path="/hostel/assign-caretaker" element={<RequireAuth><RequireAdmin><AssignCaretaker/></RequireAdmin></RequireAuth>}/>
          <Route path="/hostel/assign-warden" element={<RequireAuth><RequireAdmin><AssignWarden/></RequireAdmin></RequireAuth>}/>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/:id/student-info" element={<ViewStudentInfo />} />
          <Route path="/student/mark-attendance" element={<MarkAttendance />} />
          <Route path="/student/attendance" element={<StudentDashboard />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        </NoticeProvider>
       
      </UserProvider>
      
    
     
    

  );
}

export default App;
