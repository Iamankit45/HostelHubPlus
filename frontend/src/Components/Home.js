import React from 'react';
import { Link } from 'react-router-dom';
import hostel from '../images/hostel.jpeg';

const HomePage = () => {
  return (
    <div className="container mt-5">
      <section className="hero text-center py-5">
        <div className="container">
          <img src={hostel} className="img-fluid mb-4" alt="Hostel Management" />
          <h1>Welcome to HostelHubPlus</h1>
          <p className="lead">Your all-in-one solution for efficient hostel management.</p>
          <Link to="/dashboard" className="btn btn-primary">Get Started</Link>
        </div>
      </section>

      <hr />

      <section className="text-center my-5">
        <h2>Hostel Management Made Easy</h2>
        <p className="lead">HostelHubPlus offers a comprehensive solution for managing hostels effectively. With role-based access, users can perform a variety of tasks based on their roles.</p>
      </section>

      <hr />

      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <div className="card h-100 border border-primary rounded shadow">
            <div className="card-body">
              <h3 className="card-title text-primary">Students</h3>
              <p className="card-text">View alloted room, register complaints,apply for leave, view notices, and more.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 border border-primary rounded shadow">
            <div className="card-body">
              <h3 className="card-title text-primary">Caretakers</h3>
              <p className="card-text">Manage Rooms,manage student,Approve leave requests, manage inventory, and oversee daily operations.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <div className="card h-100 border border-primary rounded shadow">
            <div className="card-body">
              <h3 className="card-title text-primary">Wardens</h3>
              <p className="card-text">Supervise students, manage facilities, and ensure safety and security.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 border border-primary rounded shadow">
            <div className="card-body">
              <h3 className="card-title text-primary">Super Admins</h3>
              <p className="card-text">Administrate hostels,add hostels, assign roles, and oversee system management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
