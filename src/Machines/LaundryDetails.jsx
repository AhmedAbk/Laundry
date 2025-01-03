import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './laundryDetailsStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function LaundryDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCycle, setSelectedCycle] = useState({});
  const [laundryData, setLaundryData] = useState(location.state?.laundry || {});

  const handleStartCycle = async (machineId, cycleId) => {
    try {
      const response = await fetch('https://localhost:7244/api/configuration/startMachine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MachineId: machineId,
          IdCycle: cycleId
        }),
      });

      if (response.ok) {
        setLaundryData(prevData => ({
          ...prevData,
          machines: prevData.machines.map(machine =>
            machine.id === machineId
              ? { ...machine, status: true }
              : machine
          )
        }));
      }
    } catch (error) {
      console.error('Error starting machine:', error);
    }
  };

  const handleStopCycle = async (machineId) => {
    try {
      const response = await fetch('https://localhost:7244/api/configuration/stopMachine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineId),
      });

      if (response.ok) {
        setLaundryData(prevData => ({
          ...prevData,
          machines: prevData.machines.map(machine =>
            machine.id === machineId
              ? { ...machine, status: false }
              : machine
          )
        }));
      }
    } catch (error) {
      console.error('Error stopping machine:', error);
    }
  };

  return (
    <div className="laundry-details-page">
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Laundries</h1>
          <div className="nav-actions">
            <div className="user-profile">
              <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: "#fff", cursor: "pointer" }} />
            </div>
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </nav>

      <div className="details-content">
        <div className="laundry-info">
          <h1>{laundryData.nomLaverie}</h1>
          <p><strong>Address:</strong> {laundryData.address}</p>
          <div className="services">
            {laundryData.services && laundryData.services.map((service, index) => (
              <span key={index} className="service-tag">{service}</span>
            ))}
          </div>
        </div>

        <div className="machines-section">
          <h2>Machines</h2>
          <div className="machines-list">
            {laundryData.machines && laundryData.machines.map((machine) => (
              <div key={machine.id} className="machine-card">
                <h3>{machine.type}</h3>
                <p><strong>Status:</strong> {machine.status ? 'In Use' : 'Available'}</p>
                <select 
                  onChange={(e) => setSelectedCycle({...selectedCycle, [machine.id]: e.target.value})}
                  disabled={machine.status}
                >
                  <option value="">Select Cycle</option>
                  {machine.cycles.map(cycle => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.cycleDuration} - ${cycle.price}
                    </option>
                  ))}
                </select>
                {!machine.status ? (
                  <button
                    className="start-cycle-btn"
                    onClick={() => handleStartCycle(machine.id, selectedCycle[machine.id])}
                    disabled={!selectedCycle[machine.id]}
                  >
                    Start Cycle
                  </button>
                ) : (
                  <button
                    className="stop-cycle-btn"
                    onClick={() => handleStopCycle(machine.id)}
                  >
                    Stop Cycle
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaundryDetails;