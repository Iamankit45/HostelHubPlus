import React, { useContext, useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { Card, Icon, Image } from 'semantic-ui-react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import UserContext from '../Context/UserContext';
import 'semantic-ui-css/semantic.min.css';
import profile from '../images/profile.png';

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
        <Card>
            <Image src={profile} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{role}</Card.Meta>
                <Card.Description>{hostelName}</Card.Description>
            </Card.Content>
        </Card>
    );
};

export default UserCard;
