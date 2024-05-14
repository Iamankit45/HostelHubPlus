import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHostelForm = () => {

    const privateApi = useAxiosPrivate();
    // State variables to store form data
    const [name, setName] = useState('');
    const [singleSeater, setSingleSeater] = useState(0);
    const [doubleSeater, setDoubleSeater] = useState(0);
    const [tripleSeater, setTripleSeater] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send POST request to create hostel
            const response = await privateApi.post('/hostel/add-hostel', {
                name,
                singleSeater,
                doubleSeater,
                tripleSeater
            });

            // Reset form fields and show success message
            setName('');
            setSingleSeater(0);
            setDoubleSeater(0);
            setTripleSeater(0);
            setLoading(false);
            setSuccess(true);
        } catch (error) {
            // Handle error
            setError(error.response.data.error);
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Add Hostel</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Hostel Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Hostel Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Number of Single-Seater Rooms */}
                        <div className="mb-3">
                            <label htmlFor="singleSeater" className="form-label">Single Seater Rooms:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="singleSeater"
                                value={singleSeater}
                                onChange={(e) => setSingleSeater(parseInt(e.target.value))}
                                required
                            />
                        </div>

                        {/* Number of Double-Seater Rooms */}
                        <div className="mb-3">
                            <label htmlFor="doubleSeater" className="form-label">Double Seater Rooms:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="doubleSeater"
                                value={doubleSeater}
                                onChange={(e) => setDoubleSeater(parseInt(e.target.value))}
                                required
                            />
                        </div>

                        {/* Number of Triple-Seater Rooms */}
                        <div className="mb-3">
                            <label htmlFor="tripleSeater" className="form-label">Triple Seater Rooms:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="tripleSeater"
                                value={tripleSeater}
                                onChange={(e) => setTripleSeater(parseInt(e.target.value))}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Loading...' : 'Add Hostel'}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-danger text-center mt-3">{error}</p>}

                        {/* Success Message */}
                        {success && <p className="text-success text-center mt-3">Hostel added successfully!</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHostelForm;
