import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Segment, Header, Message } from 'semantic-ui-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const RegisterStudent = () => {
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    programme: '',
    batch: '',
    rollno: '',
    fathersName: '',
    mothersName: '',
    address: '',
    parentContactNo: '',
    
  });
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({
    username: '',
    rollno: ''
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosPrivate.get('/student/allStudentDetails'); // Adjust the endpoint as needed
        // console.log(response.data.student);
        setStudents(response.data.student);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [axiosPrivate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'username') {
      const usernameExists = students.some(student => student.username === value);
      setErrors(prevErrors => ({
        ...prevErrors,
        username: usernameExists ? 'Username already exists' : ''
      }));
    }

    if (name === 'rollno') {
      const rollnoExists = students.some(student => student.rollno === value);
      setErrors(prevErrors => ({
        ...prevErrors,
        rollno: rollnoExists ? 'Roll number already exists' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.username || errors.rollno) {
      alert('Please fix the errors before submitting');
      return;
    }
    try {
      const { username, password, ...studentInfo } = formData;
      const response = await axiosPrivate.post('/student/register-student/', {
        username,
        password,
        studentInfo
      });
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error registering student:', error);
      alert('Error registering student');
    }
  };

  return (
    <Container text  style={{  marginTop: '50px',padding:'0px', borderRadius: '15px', boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)' }}>
      <Segment>
        <Header as="h2" textAlign="center">Register Student</Header>
        <Form onSubmit={handleSubmit}  >
          <Form.Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username ? { content: errors.username, pointing: 'below' } : null}
            required
          />
          <Form.Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Form.Input
            label="Programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
          />
          <Form.Input
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
          />
          <Form.Input
            label="Roll Number"
            name="rollno"
            value={formData.rollno}
            onChange={handleChange}
            error={errors.rollno ? { content: errors.rollno, pointing: 'below' } : null}
          />
          <Form.Input
            label="Father's Name"
            name="fathersName"
            value={formData.fathersName}
            onChange={handleChange}
          />
          <Form.Input
            label="Mother's Name"
            name="mothersName"
            value={formData.mothersName}
            onChange={handleChange}
          />
          <Form.Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Form.Input
            label="Parent Contact Number"
            name="parentContactNo"
            value={formData.parentContactNo}
            onChange={handleChange}
          />
          
          <Button type="submit" primary fluid>Register</Button>
        </Form>
        {errors.username && <Message error content={errors.username} />}
        {errors.rollno && <Message error content={errors.rollno} />}
      </Segment>
    </Container>
  );
};

export default RegisterStudent;
