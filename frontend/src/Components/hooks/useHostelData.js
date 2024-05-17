import { useState, useEffect } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const useHostelData = () => {
    const privateApi = useAxiosPrivate();
    const [hostelData, setHostelData] = useState([]);
    const [caretakers, setCaretakers] = useState([]);
    const [wardens, setWardens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHostelData = async () => {
            try {
                const [hostelResponse, caretakerResponse, wardenResponse] = await Promise.all([
                    privateApi.get('/hostel'),
                    privateApi.get('/caretaker'),
                    privateApi.get('/warden')
                ]);
                setHostelData(hostelResponse.data);
                setCaretakers(caretakerResponse.data);
                setWardens(wardenResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHostelData();
    }, [privateApi]);

    return { hostelData, caretakers, wardens, loading, error };
};

export default useHostelData;
