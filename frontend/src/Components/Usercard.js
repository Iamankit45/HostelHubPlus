import React from 'react';
import Avatar from 'react-avatar';
import { Card, Icon, Image } from 'semantic-ui-react';

const UserCard = ({ username, role }) => {

    const userPhotoUrl = 'https://via.placeholder.com/150'; // Placeholder URL for user photo
    const firstCharacter = username ? username.charAt(0) : '';
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
            </div>
        </div>
    );
};

export default UserCard;
