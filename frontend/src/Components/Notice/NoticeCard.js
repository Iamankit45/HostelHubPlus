import React from 'react';

const NoticeCard = ({ notice }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format as needed
    };
    return (
        <div className="row justify-content-center">
        
            <div className="col-md-9 mb-4" >
            
                <div className="card shadow mb-3" style={{ border: 'none', borderRadius: '15px' }}>
                    <div className="card-body"  style={{ padding: '30px' }}>
                        <h4 className="card-title text-center">{notice.title}</h4>
                        <div className="description-box">
                            <p className="card-text">{notice.description}</p>
                        </div>
                        <br />
                        
                        <h6 className="card-subtitle mb-2  text-right">Posted by: {notice.postedBy.username}</h6>

                        <h6 className="card-subtitle mb-2 text-muted text-right">Date: {formatDate(notice.createdAt)}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeCard;
