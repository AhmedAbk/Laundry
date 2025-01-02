import React from 'react';
import './laundryDetailsStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function LaundryDetails() {
  const laundry = {
    id: 1,
    name: "Fresh & Clean Laundromat",
    address: "123 Main St, New York, NY",
    rating: 4.5,
    services: ["Dry Cleaning", "Self-Service"],
    price: "$$",
    openNow: true,
    machines: [
      { id: 1, type: "Washer", status: "Available" },
      { id: 2, type: "Washer", status: "In Use" },
      { id: 3, type: "Dryer", status: "Available" },
      { id: 4, type: "Dryer", status: "In Use" },
      { id: 5, type: "Dryer", status: "In Use" },
      { id: 2, type: "Washer", status: "In Use" },
      { id: 3, type: "Dryer", status: "Available" },
      { id: 4, type: "Dryer", status: "In Use" },
      { id: 5, type: "Dryer", status: "In Use" },
      { id: 2, type: "Washer", status: "In Use" },
      { id: 3, type: "Dryer", status: "Available" },
      { id: 4, type: "Dryer", status: "In Use" },
      { id: 5, type: "Dryer", status: "In Use" },
    ],
  };

  return (
    <div className="laundry-details-page">
     
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Laundries </h1>
          
          <div className="nav-actions">
             
          <div className="user-profile">
            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: "#fff", cursor: "pointer" }} />
          </div>
          </div>
          <button className="back-btn" onClick={() => window.history.back()}>
          &larr; Back
        </button>
        </div>
      </nav> 

      <div className="details-content">
        <div className="laundry-info">
          <h1>{laundry.name}</h1>
          <p><strong>Address:</strong> {laundry.address}</p>
          <p><strong>Rating:</strong> {laundry.rating} &#9733;</p>
          <p><strong>Services:</strong> {laundry.services.join(', ')}</p>
          <p><strong>Price Range:</strong> {laundry.price}</p>
          <p><strong>Status:</strong> {laundry.openNow ? 'Open Now' : 'Closed'}</p>
        </div>

        <div className="machines-section">
          <h2>Machines</h2>
          <div className="machines-list">
            {laundry.machines.map((machine) => (
              <div key={machine.id} className="machine-card">
                <h3>{machine.type}</h3>
                <p><strong>Status:</strong> {machine.status}</p>
                <button
                  className="start-cycle-btn"
                  disabled={machine.status !== 'Available'}
                >
                  {machine.status === 'Available' ? 'Modify Status' : 'In Use'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaundryDetails;
