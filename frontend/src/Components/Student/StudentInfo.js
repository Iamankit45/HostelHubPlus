import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaUserGraduate, FaBed, FaBuilding, FaMale, FaFemale, FaHome, FaPhoneAlt, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';
import './StudentInfo.css'; // Import custom CSS for styling

const ViewStudentInfo = () => {
  const privateApi = useAxiosPrivate();
  const { id } = useParams(); // Hostel ID

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await privateApi.get(`/hostel/${id}/students`);
        console.log(response.data);
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <p>Loading student information...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="student-info-container">
      <h1 className="student-info-title">Student Information </h1>
      <div className="student-list">
        {students.map(student => (
          <div key={student._id} className="student-card">
            <div className="student-header">
              <FaUser className="student-icon" />
              <h3 className="student-name">{student.username}</h3>
            </div>
            <div className="student-details">
              <p><FaUserGraduate /> Programme: {student.programme}</p>
              <p><FaCalendarAlt /> Batch: {student.batch}</p>
              <p><FaIdBadge /> Roll No: {student.rollno}</p>
              <p><FaBed /> Room: {student.room ? student.room.roomNumber : 'N/A'}</p>
              <p><FaBuilding /> Hostel: {student.hostel ? student.hostel.name : 'N/A'}</p>
              {/* <p><FaEnvelope /> Email: {student.username}@example.com</p> */}
              <p><FaPhone /> Contact: {student.parentContactNo}</p>
              <p><FaMale /> Father's Name: {student.fathersName}</p>
              <p><FaFemale /> Mother's Name: {student.mothersName}</p>
              <p><FaHome /> Address: {student.address}</p>
              <p><FaPhoneAlt /> Parent Contact No: {student.parentContactNo}</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewStudentInfo;
