import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

const ViewHostelDetails = () => {
    const privateApi = useAxiosPrivate(); // Initialize private API instance

    // State variable to store hostel details
    const [hostelDetails, setHostelDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHostelDetails = async () => {
            try {
                // Fetch hostel details from the backend
                const response = await privateApi.get('/hostel');
                setHostelDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchHostelDetails();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">View Hostels</h1>
            {loading ? (
                <p>Loading hostels...</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {hostelDetails.map((hostel) => (
                        <div key={hostel._id} className="col mb-4">

                            <div className="card h-100 shadow">

                                <div className="card-body">

                                    <h5 className="card-title">{hostel.name}</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Single Seater: {hostel.singleSeater}</li>
                                        <li className="list-group-item">Double Seater: {hostel.doubleSeater}</li>
                                        <li className="list-group-item">Triple Seater: {hostel.tripleSeater}</li>
                                        <li className="list-group-item">Total Rooms: {hostel.totalRooms}</li>
                                        <li className="list-group-item">Max Occupancy: {hostel.maxOccupancy}</li>
                                        <li className="list-group-item">Caretaker: {hostel.caretaker ? hostel.caretaker.username : 'Not Assigned'}</li>
                                        <li className="list-group-item">Warden: {hostel.warden ? hostel.warden.username : 'Not Assigned'}</li>

                                    </ul>
                                    {/* Button to view specific hostel details */}
                                    <Link to={`/view-hostels/${hostel._id}`} className="btn  btn-outline-info btn-sm mt-3">
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}
        </div>
    );
};

export default ViewHostelDetails;
