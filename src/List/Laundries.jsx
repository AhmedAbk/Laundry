import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './laundryStyles.css';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 

function Laundries() {
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); 
 
  const laundries = [
    {
      id: 1,
      name: "Fresh & Clean Laundromat",
      address: "123 Main St, New York, NY",
      position: { lat: 40.7128, lng: -74.0060 },
      services: ["Dry Cleaning", "Self-Service"],
      openNow: true,
      image: "data:image/jpeg;base64,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"  
    },
    {
        id:2,
        name: "See Laundromat",
        address: "123 Main St, New York, NY", 
        position: { lat: 90.7128, lng: -200.0060 },
        services: ["Dry Cleaning", "Self-Service"],
        openNow: true,
        image: "data:image/jpeg;base64,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"  
      },
  
  ];

  return (
    <div className="laundry-page">
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Laundries </h1>
            <div className="user-profile">
            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: "#fff", cursor: "pointer" }} />
          </div>
          <div className="nav-actions">
          </div>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="laundry-list">
   

          <div className="laundry-cards">
            {laundries.map(laundry => (
              <div 
                key={laundry.id} 
                className="laundry-card"
                onClick={() => {
                  setSelectedLaundry(laundry);
                  setMapCenter(laundry.position);
                }}
              > 
                <div className="card-header">
                  <div className="status-badge">
                    {laundry.openNow ? 'Open Now' : 'Closed'}
                  </div>
                  <div className="wait-time">
                    <i className="far fa-clock"></i>
                    {laundry.waitTime}
                  </div>
                </div>

                <div className="card-body">
                  <h3>{laundry.name}</h3>
                  <div className="rating">
                    <span className="stars">
                      {'★'.repeat(Math.floor(laundry.rating))}
                      {'☆'.repeat(5 - Math.floor(laundry.rating))}
                    </span>
                    <span className="rating-number">{laundry.rating}</span>
                  </div>
                  <p className="address">
                    <i className="fas fa-map-marker-alt"></i>
                    {laundry.address}
                  </p>
                  <div className="services">
                    {laundry.services.map((service, index) => (
                      <span key={index} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span className="price">{laundry.price}</span>
                    <button className="book-btn">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-container">
          <LoadScript googleMapsApiKey="AIzaSyDZ8k_xI_6x4qRSjRu0Cut7alqGLWOxAhM">
            <GoogleMap
              mapContainerClassName="map"
              center={mapCenter}
              zoom={14}
            >
              {laundries.map(laundry => (
                <Marker
                  key={laundry.id}
                  position={laundry.position}
                  onClick={() => setSelectedLaundry(laundry)}
                />
              ))}

              {selectedLaundry && (
                <InfoWindow
                  position={selectedLaundry.position}
                  onCloseClick={() => setSelectedLaundry(null)}
                >
                  <div className="info-window">
                    <h3>{selectedLaundry.name}</h3>
                    <p>{selectedLaundry.address}</p> 
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default Laundries;