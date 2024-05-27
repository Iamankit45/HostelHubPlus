
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
import StudentComplaints from './Components/Complaint/StudentComplaint';
import  CaretakerComplaints from './Components/Complaint/CaretakerComplaint'
import StudentLeaveRequest from './Components/Leave/StudentLeaveRequest'
import LeaveRequestsForCaretaker from './Components/Leave/CaretakerLeaveRequest'
import StudentLeaveStatus from './Components/Leave/StudentLeaveStatus'
import ViewFinesForCaretaker from './Components/Fine/ViewFInes';
import StudentFines from './Components/Fine/StudentFine';
import ImposeFine from './Components/Fine/ImposeFine';
import AddItemForm from './Components/Inventory/AddInventory';
import EditItemForm from './Components/Inventory/EditItemForm';
import InventoryList from './Components/Inventory/InventoryList';
import StaffForm from './Components/Staff/StaffForm';
import StaffScheduleForm from './Components/Staff/StaffSchedule';
import RegisterStudent from './Components/Student/RegisterStudent'
import RequestRoomChange from './Components/Student/RequestRoomChange'

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
          
          <Route path="/view-hostels/:id" element={<RequireAuth><SpecificHostelDetails/></RequireAuth>}/>
          <Route path="/admin/hostel-allotment" element={<RequireAuth><RequireAdmin><HostelAllotment/></RequireAdmin></RequireAuth>}/>
          <Route path ="/hostel/:id/manual-allocation" element={<RequireAuth><RequireNotStudent><ManualRoomAllocation/></RequireNotStudent></RequireAuth>}/>
          <Route path="/hostel/assign-caretaker" element={<RequireAuth><RequireAdmin><AssignCaretaker/></RequireAdmin></RequireAuth>}/>
          <Route path="/hostel/assign-warden" element={<RequireAuth><RequireAdmin><AssignWarden/></RequireAdmin></RequireAuth>}/>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/:id/student-info" element={<RequireAuth><RequireNotStudent><ViewStudentInfo /></RequireNotStudent></RequireAuth>} />
          <Route path="/student/mark-attendance" element={<RequireAuth><RequireNotStudent><MarkAttendance /></RequireNotStudent></RequireAuth>} />
          <Route path="/student/attendance" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
          <Route path="/student/register-complaint" element={<RequireAuth><StudentComplaints /></RequireAuth>} />
          <Route path ="/caretaker/complaints" element={ <RequireAuth><RequireNotStudent><CaretakerComplaints/></RequireNotStudent></RequireAuth>}/>
          <Route path ="/student/create-leave" element={ <RequireAuth><StudentLeaveRequest/></RequireAuth>}/>
          <Route path="/caretaker/leave" element={<RequireAuth><LeaveRequestsForCaretaker/></RequireAuth>}/>
          <Route path="/student/leave-status" element={ <RequireAuth><StudentLeaveStatus/></RequireAuth>}/>
          <Route path="/student/fines" element={ <RequireAuth><StudentFines/></RequireAuth>}/>
          <Route path="/caretaker/impose-fine" element={<RequireAuth><ImposeFine/></RequireAuth>}/>
          <Route path="/caretaker/view-fines" element={<RequireAuth><ViewFinesForCaretaker/></RequireAuth>}/>

          <Route path="/addInventory/"element={<RequireAuth><AddItemForm/></RequireAuth>}/>
          <Route path="/edit-Inventory/"element={<RequireAuth><EditItemForm/></RequireAuth>}/>
          <Route path="/inventory/"element={<RequireAuth><InventoryList/></RequireAuth>}/>
          
          
          <Route path="/add-staff/" element={<RequireAuth><StaffForm/></RequireAuth>}/>
          <Route path="/staff-schedule/" element={<RequireAuth><StaffScheduleForm/></RequireAuth>}/>
          <Route path="/register-student/" element={<RequireAuth><RequireAdmin><RegisterStudent/></RequireAdmin></RequireAuth>}/>
          <Route path="/request-room-change/" element={<RequireAuth><RequestRoomChange/></RequireAuth>}/>
          <Route path="/" element={<HomePage />} />
        </Routes>
        </NoticeProvider>
       
      </UserProvider>
      
    
     
    

  );
}

export default App;
