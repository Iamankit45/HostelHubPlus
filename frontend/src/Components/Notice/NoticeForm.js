import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { useNoticeContext  } from '../../Context/NoticeContext'; // Import the NoticeContext
import { useAuth } from '../../Context/UserContext'; // Import the useAuth hook

const NoticeForm = () => {
  // Use the custom hook to get the private API instance
  const privateApi = useAxiosPrivate();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshNotices } = useNoticeContext();

  // State variables to store form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send a POST request to create a new notice
      const response = await privateApi.post('/notice', {
        title,
        description,
      });

      // Reset form fields after successful submission
      setTitle('');
      setDescription('');

      // Handle success response (optional)
      console.log('Notice created:', response.data);
      alert('Notice created successfully.');
      refreshNotices();
      navigate('/notice');

    } catch (error) {
      // Handle error response (optional)
      console.error('Error creating notice:', error);
    }
  };
  // Check if user is not caretaker, then redirect to another page
  if (user && user.role === 'student') {
    navigate('/notice'); // Redirect to another page (change the path as needed)
    return null; // Render nothing
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4"> Notice Form</h2>
         
          <form  clasName = "ui form"onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary">Create Notice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
