import React, { useState } from 'react';
import useHostelData from '../hooks/useHostelData';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AssignWarden = () => {
    const { hostelData, wardens, loading, error } = useHostelData();
    const privateApi = useAxiosPrivate();
    const [selectedHostel, setSelectedHostel] = useState('');
    const [selectedWarden, setSelectedWarden] = useState('');
    const [assigning, setAssigning] = useState(false);

    const handleAssignWarden = async () => {
        setAssigning(true);
        try {
            await privateApi.post('/hostel/assign-warden', {
                hostelId: selectedHostel,
                wardenId: selectedWarden
            });
            alert('Warden assigned successfully!');
            window.location.reload();
        } catch (err) {
            alert('Error assigning warden:', err.message);
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">

                    <h1 className="text-center mb-4">Assign Warden</h1>
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
                        <label htmlFor="wardenSelect" className="form-label">Select Warden</label>
                        <select
                            id="wardenSelect"
                            className="form-select"
                            value={selectedWarden}
                            onChange={(e) => setSelectedWarden(e.target.value)}
                        >
                            <option value="">Select a warden</option>
                            {wardens.map((warden) => (
                                <option key={warden._id} value={warden._id}>
                                    {warden.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn btn-success w-100"
                        onClick={handleAssignWarden}
                        disabled={!selectedHostel || !selectedWarden || assigning}
                    >
                        {assigning ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Assigning...
                            </>
                        ) : (
                            'Assign Warden'
                        )}            </button>
                </div>
            </div>
            <h2 className="text-center mt-5">Hostel Wardens</h2>
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
                                    </li></ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignWarden;