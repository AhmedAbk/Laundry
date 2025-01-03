import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './laundryStyles.css';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function Laundries() {
  const navigate = useNavigate();
  const [laundries, setLaundries] = useState([]);  
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); 
 
  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/configuration');
        const data = await response.json(); 
        const allLaundries = data.flatMap(user => user.laundries);
        setLaundries(allLaundries);  
      } catch (error) {
        console.error("Error fetching laundries:", error);
      }
    };
  
    fetchLaundries();
  }, []);
  const handleBookNow = (laundry) => {
    navigate(`/laundry-details/${laundry.id}`, { state: { laundry } });
  };
  return (
    <div className="laundry-page">
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Laundries </h1>
          <div className="user-profile">
            <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: "#fff", cursor: "pointer" }} />
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
                  setMapCenter({ lat: laundry.latitude, lng: laundry.longitude });  
                }}
              > 
                <div className="card-header">
                  <div className="status-badge">
                    {laundry.openNow ? 'Open Now' : 'Open Now'}
                  </div>
                </div>

                <div className="card-body">
                  <h3>{laundry.nomLaverie}</h3>
                  <p className="address">
                    <i className="fas fa-map-marker-alt"></i>
                    {laundry.address}
                  </p>
              
                  <div className="services">
                    {laundry.services && laundry.services.map((service, index) => (
                      <span key={index} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer"> 
        <button className="book-btn" onClick={(e) => {
        e.stopPropagation();
        handleBookNow(laundry);
      }}>Book Now</button>
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
                  position={{ lat: laundry.latitude, lng: laundry.longitude }}
                  onClick={() => setSelectedLaundry(laundry)}
                />
              ))}

              {selectedLaundry && (
                <InfoWindow
                  position={{ lat: selectedLaundry.latitude, lng: selectedLaundry.longitude }}
                  onCloseClick={() => setSelectedLaundry(null)}
                >
                  <div className="info-window">
                    <h3>{selectedLaundry.nomLaverie}</h3>
                    <p>{selectedLaundry.address}</p>
                    <div className="services">
                      {selectedLaundry.services.map((service, index) => (
                        <span key={index} className="service-tag">
                          {service}
                        </span>
                      ))}
                    </div>
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