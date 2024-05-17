import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/UserContext'; // Import the useAuth hook
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNoticeContext } from '../../Context/NoticeContext';

const NoticeCard = ({ notice }) => {

    const { user } = useAuth();
    const privateApi = useAxiosPrivate();
    const { refreshNotices } = useNoticeContext();
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format as needed
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm('Are you sure you want to delete this notice?');

        if (confirmDelete) {


            try {
                await privateApi.delete(`/notice/${notice._id}`);
                refreshNotices(); // Refresh the notice list after deletion
            } catch (error) {
                console.error('Error deleting notice:', error);
            }
        }
    };
    return (
        <div className="row justify-content-center">

            <div className="col-md-9 mb-4" >

                <div className="card shadow mb-3" style={{ border: 'none', borderRadius: '15px' }}>
                    <div className="card-body" style={{ padding: '30px' }}>
                        <h4 className="card-title text-center">{notice.title}</h4>
                        <div className="description-box">
                            <p className="card-text">{notice.description}</p>
                        </div>
                        <br />

                        <h6 className="card-subtitle mb-2  text-right">Posted by: {notice.postedBy.username}</h6>
                        <h6 className="card-subtitle mb-2  text-right">{notice.postedBy.role}</h6>

                        <h6 className="card-subtitle mb-2 text-muted text-right">Date: {formatDate(notice.createdAt)}</h6>
                        {user && user.role !== 'student' && (
                            <>
                                <div>
                                    {/* Edit button */}
                                    <Link to={`/edit-notice/${notice._id}`} className="btn btn-primary">Edit</Link>
                                </div>
                                <br></br>
                                <div>
                                    <button onClick={handleDelete} className="btn btn-danger">Delete</button></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeCard;
