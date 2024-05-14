import React from 'react';

const NoticeCard = ({ notice }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format as needed
      };
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h3 className="card-title text-center">{notice.title}</h3>
                <div className="description-box">
                    <p className="card-text">{notice.description}</p>
                </div>
                <br/>
                <h6 className="card-subtitle mb-2  text-right">Posted by: {notice.postedBy.username}</h6>
                
                <h6 className="card-subtitle mb-2 text-muted text-right">Date: {formatDate(notice.createdAt)}</h6>
            </div>
        </div>
    );
};

export default NoticeCard;
