import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './laundryDetailsStyles.css';

function LaundryDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [laundryData, setLaundryData] = useState(location.state?.laundry || {});
    const [editingMachine, setEditingMachine] = useState(null);
    const [updatedType, setUpdatedType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [ws, setWs] = useState(null);
 
    useEffect(() => {
        const websocket = new WebSocket('wss://localhost:7244/ws');
        
        websocket.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data); 

                if (data.action === 'updateMachineStatus') {
                    setLaundryData((prevData) => {
                        const updatedMachines = prevData.machines.map((machine) =>
                            machine.id === data.machineId
                                ? {
                                      ...machine,
                                      status: data.status === 1 ? 'In Use' : 'Available', 
                                  }
                                : machine
                        );
 
                        return {
                            ...prevData,
                            machines: updatedMachines,
                        };
                    });
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        setWs(websocket);

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, []);
 
    const sendWebSocketMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    };
 
    const calculateMachineIncome = (machine) => {
        return machine.cycles.reduce((total, cycle) => {
            return total + (cycle.transactions?.length || 0) * cycle.price;
        }, 0);
    };
 
    const handleDeleteMachine = async (machineId) => {
        try {
            const response = await fetch(`https://localhost:7244/api/machine/delete/${machineId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setLaundryData((prevData) => ({
                    ...prevData,
                    machines: prevData.machines.filter((machine) => machine.id !== machineId),
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
                setLaundryData((prevData) => ({
                    ...prevData,
                    machines: prevData.machines.map((machine) =>
                        machine.id === machineId ? { ...machine, type: updatedType } : machine
                    ),
                }));
                setIsModalOpen(false);
                setUpdatedType('');
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
                    <p>
                        <strong>Address:</strong> {laundryData.address}
                    </p>
                    <div className="services">
                        {laundryData.services &&
                            laundryData.services.map((service, index) => (
                                <span key={index} className="service-tag">
                                    {service}
                                </span>
                            ))}
                    </div>
                </div>

                <div className="machines-section">
                    <h2>Machines</h2>
                    <div className="machines-list">
                        {laundryData.machines &&
                            laundryData.machines.map((machine) => (
                                <div key={machine.id} className="machine-card">
                                    <h3>{machine.type}</h3>
                                    <p>
                                        <strong>Total Income:</strong> ${calculateMachineIncome(machine)}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {machine.status}
                                    </p>

                                    <button className="update-btn" onClick={() => openEditModal(machine)}>
                                        Update
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteMachine(machine.id)}>
                                        Delete
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

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