import React, { useContext, useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { Card, Icon, Image } from 'semantic-ui-react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import UserContext from '../Context/UserContext';

const UserCard = ({ username, role, hostel }) => {

    const [hostelName, setHostelName] = useState(null);
    const privateApi = useAxiosPrivate();
    const userPhotoUrl = 'https://via.placeholder.com/150'; // Placeholder URL for user photo
    const firstCharacter = username ? username.charAt(0) : '';
    const { user } = useContext(UserContext);

    // console.log(user.hostel)

    useEffect(() => {

        if (role != 'hosteladmin') {
            privateApi.get(`/hostel/${hostel}`)
                .then(response => {
                    // console.log(response.data.hostel.name);
                    setHostelName(response.data.hostel.name);
                })
                .catch(error => {
                    console.error('Error fetching hostel name:', error);
                });
        }
        // Fetch hostel name from private API based on hostel ID


    }, [user]);
    return (
        <div className="card">

            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px', backgroundColor: '#f0f0f0' }}>
                <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px' }}>
                    <span className="text-light">{firstCharacter}</span>
                </div>
            </div>
            <div className="card-body">
                <h5 className="card-title">{username}</h5>

                <p className="card-text"> {role}</p>
                <p className="card-text">{hostelName}</p>
            </div>
        </div>
    );
};

export default UserCard;
