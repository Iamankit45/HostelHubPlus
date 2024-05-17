import React, { useState } from 'react';
import useHostelData from '../hooks/useHostelData';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AssignCaretaker = () => {
    const { hostelData, caretakers, loading, error } = useHostelData();
    const privateApi = useAxiosPrivate();
    const [selectedHostel, setSelectedHostel] = useState('');
    const [selectedCaretaker, setSelectedCaretaker] = useState('');
    const [assigning, setAssigning] = useState(false);

    const handleAssignCaretaker = async () => {
        setAssigning(true);
        try {
            await privateApi.post('/hostel/assign-caretaker', {
                hostelId: selectedHostel,
                caretakerId: selectedCaretaker
            });
            window.location.reload();
            alert('Caretaker assigned successfully!');
        } catch (err) {
            alert('Error assigning caretaker:', err.message);
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <div className="d-flex justify-content-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger" role="alert">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                <h1 className="text-center mb-4">Assign Caretaker</h1>
                <div className="mb-4">
                    <label htmlFor="hostelSelect" className="form-label">Select Hostel</label>
                    <select
                        id="hostelSelect"
                        className="form-select"
                        value={selectedHostel}
                        onChange={(e) => setSelectedHostel(e.target.value)}
                    >
                        <option value="">Select a hostel</option>
                        {hostelData.map((hostel) => (
                            <option key={hostel._id} value={hostel._id}>
                                {hostel.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="caretakerSelect" className="form-label">Select Caretaker</label>
                    <select
                        id="caretakerSelect"
                        className="form-select"
                        value={selectedCaretaker}
                        onChange={(e) => setSelectedCaretaker(e.target.value)}
                    >
                        <option value="">Select a caretaker</option>
                        {caretakers.map((caretaker) => (
                            <option key={caretaker._id} value={caretaker._id}>
                                {caretaker.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="btn btn-success w-100"
                    onClick={handleAssignCaretaker}
                    disabled={!selectedHostel || !selectedCaretaker || assigning}
                >
                    {assigning ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Assigning...
                        </>
                    ) : (
                        'Assign Caretaker'
                    )}
                </button>
                </div>
                </div>
                <h2 className="text-center mt-5">Hostel Caretakers</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {hostelData.map((hostel) => (
                        <div key={hostel._id} className="col mb-4">
                            <div className="card h-100 shadow">
                                <div className="card-body">
                                    <h5 className="card-title">{hostel.name}</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <i className="fas fa-user-shield me-2"></i>
                                            Caretaker: {hostel.caretaker ? hostel.caretaker.username : 'None'}
                                        </li>
                                        <li className="list-group-item">
                                            <i className="fas fa-user-tie me-2"></i>
                                            Warden: {hostel.warden ? hostel.warden.username : 'None'}
                                        </li> </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            );
};

            export default AssignCaretaker;
