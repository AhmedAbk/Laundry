import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserManagementStyles.css'; // Add styles for the page

function UserManagement() {
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: 0,
    name: '',
    email: '',
    age: 0,
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7244/api/user/1`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7244/api/user/update/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: user.name,
          Email: user.email,
          Age: user.age,
          Password: user.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      alert('User details updated successfully!');
      navigate('/user'); // Redirect to the user page after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-management-page">
      <h1>Manage User Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserManagement;