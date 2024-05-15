import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewHostelDetails.css';
import { FaUser, FaBed, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';

const ITEMS_PER_PAGE = 12; // Number of rooms per page

const HostelDetails = () => {
  const { id } = useParams();
  const privateApi = useAxiosPrivate();
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await privateApi.get(`/hostel/${id}`);
        console.log("API Response:", response.data); // Debugging
        setHostel(response.data.hostel);
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hostel details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id, privateApi]);

  if (loading) {
    return <p>Loading hostel details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{hostel?.name || "Hostel Name Not Found"} Room Details</h1>
      <div className="row">
        {['Single Seater', 'Double Seater', 'Triple Seater'].map((type) => (
          <RoomTypeSection key={type} type={type} rooms={rooms} />
        ))}
      </div>
    </div>
  );
};

const RoomTypeSection = ({ type, rooms }) => {
  const filteredRooms = rooms.filter(room => room.roomType === type);
  const totalRooms = filteredRooms.length;
  const occupiedSeats = filteredRooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const vacantSeats = filteredRooms.reduce((acc, room) => acc + room.availableSeats, 0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalRooms / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="col-12 mb-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>{type}</h3>
          <div>
            <span className="me-3">
              <FaBed /> Total Rooms: {totalRooms}
            </span>
            <span className="me-3">
              <FaUser /> Occupied Seats: {occupiedSeats}
            </span>
            <span>
              <FaDoorOpen /> Vacant Seats: {vacantSeats}
            </span>
          </div>
        </div>
        <div className="card-body room-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div className="row">
            {paginatedRooms.map(room => (
              <RoomDetail key={room._id} room={room} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

const RoomDetail = ({ room }) => {
  const roomClass = room.availableSeats === 0 ? 'room-card-occupied' : 'room-card';
  
  return (
    <div className="col-md-3 mb-3">
      <div className={`card h-100 ${roomClass}`}>
        <div className="card-body">
          <h5 className="card-title">Room Number: {room.roomNumber}</h5>
          <p className="card-text">
            <FaDoorClosed /> Vacant Seats: {room.availableSeats}
          </p>
          {room.occupants.length > 0 ? (
            <ul className="list-group list-group-flush">
              {room.occupants.map(occupant => (
                <li key={occupant._id} className="list-group-item">
                  {occupant.username} ({occupant.batch})
                </li>
              ))}
            </ul>
          ) : (
            <p className="card-text text-muted">No occupants</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number && 'active'}`}>
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default HostelDetails;