import React, { useContext } from 'react';
import NoticeCard from './NoticeCard'; // Import the NoticeCard component
import { NoticeContext } from '../../Context/NoticeContext'; // Import the NoticeContext
import { useAuth } from '../../Context/UserContext'; // Import the useAuth hook
import { Link } from 'react-router-dom';
import Dashboard from '../Dashboard';



const DashNoticeBoard = () => {
    const { user } = useAuth();
    // Access notices and loading state from the NoticeContext
    const { notices, loading } = useContext(NoticeContext);

    // If loading, display a loading message
    if (loading) {
        return <p>Loading notices...</p>;
    }
    let navigationLinks = [];
    if (user && user.role!== 'student') {
        navigationLinks = [
            {
                label: 'Create Notice', to: '/create-notice',
            }
        ]
    }


    return (

        <>
        <div style={{borderRadius: '10px' ,backgroundColor: '#f8f9fa'}}>
        <h1 className="text-center mb-4">Notice Board</h1>
            <div className="container mt-7" style={{borderRadius: '10px' ,backgroundColor: '#f8f9fa'}}>

                
                <div className="row">

                    {/* <div className="col-md-12">
                        <div className="text-md-right mb-3">
                            {user && user.role!== 'student' && ( // Check if user is not student
                                <Link to="/create-notice" className="btn btn-primary  btn">Create</Link>
                            )}
                        </div>
                    </div> */}
                    
                    <div className="overflow-auto" style={{maxHeight:'650px',overflowY: 'hidden',msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch',borderRadius: '10px'}}> <style>
                        {`
                            .overflow-auto::-webkit-scrollbar {
                                display: none;  // for Chrome, Safari, and Opera
                            }
                        `}
                    </style>
                    {/* <br></br> */}
                    {notices.map((notice) => (
                        
                        <div key={notice._id} className="col-md-12"  >
                        
                            {/* Render NoticeCard component for each notice */}
                              <NoticeCard notice={notice} />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            </div>
            
        </>
    );
};

export default DashNoticeBoard;
