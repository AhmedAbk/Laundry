import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './laundryDetailsStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function LaundryDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCycle, setSelectedCycle] = useState({});
  const [laundryData, setLaundryData] = useState(location.state?.laundry || {});
  const [editingMachine, setEditingMachine] = useState(null); // State to track which machine is being edited
  const [updatedType, setUpdatedType] = useState(''); // State to store the updated machine type
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const calculateMachineIncome = (machine) => {
    return machine.cycles.reduce((total, cycle) => {
      return total + (cycle.transactions?.length || 0) * cycle.price;
    }, 0);
  };

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

  const handleDeleteMachine = async (machineId) => {
    try {
      const response = await fetch(`https://localhost:7244/api/machine/delete/${machineId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLaundryData(prevData => ({
          ...prevData,
          machines: prevData.machines.filter(machine => machine.id !== machineId)
        }));
      } else {
        console.error('Failed to delete machine');
      }
    } catch (error) {
      console.error('Error deleting machine:', error);
    }
  };

  const handleUpdateMachine = async (machineId) => {
    try {
      const response = await fetch(`https://localhost:7244/api/machine/update/${machineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: updatedType }),
      });

      if (response.ok) {
        setLaundryData(prevData => ({
          ...prevData,
          machines: prevData.machines.map(machine =>
            machine.id === machineId
              ? { ...machine, type: updatedType }
              : machine
          )
        }));
        setIsModalOpen(false); // Close the modal
        setUpdatedType(''); // Clear the input field
      } else {
        console.error('Failed to update machine');
      }
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  const openEditModal = (machine) => {
    setEditingMachine(machine.id);
    setUpdatedType(machine.type);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingMachine(null);
    setUpdatedType('');
  };

  return (
    <div className="laundry-details-page">
      <nav className="laundry-nav">
        <div className="nav-content">
          <h1>Your Machines</h1>
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
                <p><strong>Total Income:</strong> ${calculateMachineIncome(machine)}</p>
                <p><strong>Status:</strong> {machine.status ? 'In Use' : 'Available'}</p>
                <select
                  onChange={(e) => setSelectedCycle({ ...selectedCycle, [machine.id]: e.target.value })}
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
                <button
                  className="update-btn"
                  onClick={() => openEditModal(machine)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteMachine(machine.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Editing Machine */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Machine Type</h3>
            <input
              type="text"
              value={updatedType}
              onChange={(e) => setUpdatedType(e.target.value)}
              placeholder="Enter new machine type"
            />
            <div className="modal-buttons">
              <button className="save-btn" onClick={() => handleUpdateMachine(editingMachine)}>
                Save
              </button>
              <button className="cancel-btn" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaundryDetails;