import React from 'react';

const RoomDetail = ({ room }) => {
  return (
    <div className="col">
      <div className="card mb-3 h-100">
        <div className="card-body">
          <h5 className="card-title">Room Number: {room.roomNumber}</h5>
          <p className="card-text">Vacant Seats: {room.availableSeats}</p>
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

export default RoomDetail;
