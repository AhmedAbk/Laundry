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
  const [editingLaundry, setEditingLaundry] = useState(null);

  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        const response = await fetch('https://localhost:7244/api/configuration');
        const data = await response.json(); 
        const allLaundries = data.flatMap(user => user.laundries);
        setLaundries(allLaundries);  
        console.log(data);
      } catch (error) {
        console.error("Error fetching laundries:", error);
      }
    };
  
    fetchLaundries();
  }, []);

  const handleBookNow = (laundry) => {
    navigate(`/laundry-details/${laundry.id}`, { state: { laundry } });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7244/api/Laundry/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLaundries(laundries.filter(laundry => laundry.id !== id));
      } else {
        console.error("Failed to delete laundry");
      }
    } catch (error) {
      console.error("Error deleting laundry:", error);
    }
  };

  const handleUpdate = (laundry) => {
    setEditingLaundry(laundry);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://localhost:7244/api/Laundry/update/${editingLaundry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingLaundry),
      });
      if (response.ok) {
        setLaundries(laundries.map(laundry => laundry.id === editingLaundry.id ? editingLaundry : laundry));
        setEditingLaundry(null);
      } else {
        console.error("Failed to update laundry");
      }
    } catch (error) {
      console.error("Error updating laundry:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingLaundry({
      ...editingLaundry,
      [name]: value,
    });
  };

  return (
    <div className="laundry-page">
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Laundries </h1>
          <div className="user-profile" onClick={() => navigate('/user')}>
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
  <div>
    <button 
      className="update-btn" 
      onClick={(e) => { 
        e.stopPropagation(); 
        handleUpdate(laundry); 
      }}
    >
      Update
    </button>
    <button 
      className="delete-btn" 
      onClick={(e) => { 
        e.stopPropagation(); 
        handleDelete(laundry.id); 
      }}
    >
      Delete
    </button>
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
                    }}>Visualize Data</button>
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

      {editingLaundry && (
        <div className="edit-modal">
          <form onSubmit={handleUpdateSubmit}>
            <h2>Edit Laundry</h2>
            <label>
              Name:
              <input type="text" name="nomLaverie" value={editingLaundry.nomLaverie} onChange={handleInputChange} />
            </label>
            <label>
              Address:
              <input type="text" name="address" value={editingLaundry.address} onChange={handleInputChange} />
            </label>
            <label>
              Latitude:
              <input type="number" name="latitude" value={editingLaundry.latitude} onChange={handleInputChange} />
            </label>
            <label>
              Longitude:
              <input type="number" name="longitude" value={editingLaundry.longitude} onChange={handleInputChange} />
            </label>
            <label>
              Services:
              <input type="text" name="services" value={editingLaundry.services.join(', ')} onChange={(e) => {
                setEditingLaundry({
                  ...editingLaundry,
                  services: e.target.value.split(',').map(s => s.trim()),
                });
              }} />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingLaundry(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Laundries;