import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/UserContext'; // Import the useAuth hook
import { useNoticeContext  } from '../../Context/NoticeContext'; // Import the NoticeContext

const EditNoticeForm = () => {
  const { id } = useParams();
  const privateApi = useAxiosPrivate();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshNotices } = useNoticeContext();

  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await privateApi.put(`/notice/${id}`);
        const { title, description } = response.data;
        setTitle(title);
        setDescription(description);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };
    if (user && user.role == 'student') {
        navigate('/notice');
      }

    fetchNotice();
  }, [id, privateApi]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await privateApi.put(`/notice/${id}`, {
        title,
        description,
      });
      alert('Notice edited  successfully.');
      refreshNotices();
      navigate('/notice');
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Edit Notice</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">Update Notice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeForm;
