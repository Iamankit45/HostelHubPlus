import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const NoticeForm = () => {
  // Use the custom hook to get the private API instance
  const privateApi = useAxiosPrivate();

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
    } catch (error) {
      // Handle error response (optional)
      console.error('Error creating notice:', error);
    }
  };

  return (
    <div>
      <h2>Create Notice</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Create Notice</button>
      </form>
    </div>
  );
};

export default NoticeForm;
