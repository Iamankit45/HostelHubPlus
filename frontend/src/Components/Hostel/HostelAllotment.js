import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'bootstrap/dist/css/bootstrap.min.css';

const HostelAllotment = () => {
  const privateApi = useAxiosPrivate();
  const [hostels, setHostels] = useState([]);
  const [batches, setBatches] = useState(['2021', '2020', '2019', '2022', '2023']);
  const [students, setStudents] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await privateApi.get('/hostel');
        setHostels(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedBatch) {
        try {
          const response = await privateApi.get(`/student?batch=${selectedBatch}`);
          setStudents(response.data.map(student => ({
            ...student,
            currentHostel: student.hostel ? student.hostel.name : null
          })));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudents();
  }, [selectedBatch]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prevSelected =>
      prevSelected.includes(studentId)
        ? prevSelected.filter(id => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleAllotment = async () => {
    try {
      await privateApi.post('/hostel/allot-hostel', {
        hostelId: selectedHostel,
        studentIds: selectedStudents
      });
      alert('Hostel allotted successfully!');
      window.location.reload(); // Reload the page after successful allotment
      setSelectedStudents([]); // Clear selected students after allotment
      // Optionally, refresh the students list to reflect changes
      const response = await privateApi.get(`/student?batch=${selectedBatch}`);
      setStudents(response.data.map(student => ({
        ...student,
        currentHostel: student.hostel ? student.hostel.name : null
      })));
    } catch (error) {
      console.error('Error allotting hostel:', error);
    }
  };

  return (
    
    <div className="container mt-5 d-flex justify-content-center ">
      <div className="card p-4" style={{ width: '100%', maxWidth: '800px' }}>
        <h1 className="text-center mb-4">Hostel Allotment</h1>
        <div className="mb-4">
          <label htmlFor="hostelSelect" className="form-label">Select Hostel</label>
          <select
            id="hostelSelect"
            className="form-select"
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
          >
            <option value="">Select a hostel</option>
            {hostels.map((hostel) => (
              <option key={hostel._id} value={hostel._id}>
                {hostel.name} (Available: {hostel.maxOccupancy - (hostel.students ? hostel.students.length : 0)})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="batchSelect" className="form-label">Select Batch</label>
          <select
            id="batchSelect"
            className="form-select"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select a batch</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        {selectedBatch && (
          <div className="mb-4">
            <h5>Students in Batch {selectedBatch}</h5>
            <div className="list-group" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {students.map((student) => (
                <div
                  key={student._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{student.username} ({student.rollno})</span>
                  <span>Current Allotment: {student.currentHostel || 'Not allotted'}</span>
                  <button
                    className={`btn btn-sm btn-${selectedStudents.includes(student._id) ? 'danger' : 'primary'}`}
                    onClick={() => handleStudentSelection(student._id)}
                  >
                    {selectedStudents.includes(student._id) ? 'Deselect' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4">
          <h5>Selected Students: {selectedStudents.length}</h5>
        </div>
        <button
          className="btn btn-success w-100"
          onClick={handleAllotment}
          disabled={!selectedHostel || selectedStudents.length === 0}
        >
          Allot Hostel
        </button>
      </div>
    </div>
  );
};

export default HostelAllotment;
