import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Row, Col, Container } from 'react-bootstrap';

const HostelAllotment = () => {
  const privateApi = useAxiosPrivate();
  const [hostels, setHostels] = useState([]);
  const [batches, setBatches] = useState(['2021', '2020', '2019', '2022', '2023']);
  const [students, setStudents] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hostelCapacity, setHostelCapacity] = useState(0);

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

  useEffect(() => {
    if (selectedHostel) {
      const hostel = hostels.find(h => h._id === selectedHostel);
      if (hostel) {
        const capacity = hostel.maxOccupancy - (hostel.students ? hostel.students.length : 0);
        setHostelCapacity(capacity);
      }
    }
  }, [selectedHostel, hostels]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else if (prevSelected.length < hostelCapacity) {
        return [...prevSelected, studentId];
      } else {
        setShowWarning(true);
        return prevSelected;
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length < hostelCapacity) {
      const allStudentIds = students.map(student => student._id);
      const availableSlots = hostelCapacity - selectedStudents.length;
      const studentsToSelect = allStudentIds.slice(0, availableSlots);
      setSelectedStudents(prevSelected => [...prevSelected, ...studentsToSelect]);
    } else {
      setShowWarning(true);
    }
  };

  const handleAllotment = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getStudentCountByProgramme = (programme) => {
    return students.filter(student => student.programme === programme).length;
  };
  const alreadyAllotted = students.filter(student => student.currentHostel).length;
  const leftToAllot = students.length - alreadyAllotted;

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
            <div className="d-flex justify-content-between align-items-center">
              {/* <h5>Batch {selectedBatch}</h5> */}
              <div className="row">
                <div className="col-auto mb-2">
                  <span className="badge bg-primary">Total: {students.length}</span>
                </div>
                <div className="col-auto mb-2">
                  <span className="badge bg-secondary">CSE: {getStudentCountByProgramme('CSE')}</span>
                </div>
                <div className="col-auto mb-2">
                  <span className="badge bg-success">ECE: {getStudentCountByProgramme('ECE')}</span>
                </div>
                <div className="col-auto mb-2">
                  <span className="badge bg-danger">MECH: {getStudentCountByProgramme('MECH')}</span>
                </div>
                <div className="col-auto mb-2">
                  <span className="badge bg-warning text-dark">SM: {getStudentCountByProgramme('SM')}</span>
                </div>
                <div className="col-auto mb-2">
                  <span className="badge bg-info text-dark">DS: {getStudentCountByProgramme('DS')}</span>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-sm  btn-outline-primary" onClick={handleSelectAll}>Select All</button>
              <div>
                <span className="badge bg-info me-2">Allotted: {alreadyAllotted}</span>
                <span className="badge bg-warning">Need to Allot: {leftToAllot}</span>
              </div>
            </div>
            <div className="list-group mt-3" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {students.map((student) => (
                <div
                  key={student._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{student.username} ({student.rollno})</span>
                  <span>Alloted Hostel: {student.currentHostel || 'Not allotted'}</span>
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
          className="btn btn-success btn-lg btn-block"
          onClick={handleAllotment}
          disabled={!selectedHostel || selectedStudents.length === 0}
        >
          Allot Hostel
        </button>
        {loading && (
          <div className="mt-3 text-center">
            <p>Allotment is processing...</p>
          </div>
        )}
        <Modal show={showWarning} onHide={() => setShowWarning(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Selection Limit Exceeded</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have selected more students than the available capacity. Please deselect some students before proceeding.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWarning(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default HostelAllotment;
