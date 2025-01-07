import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    age: '',  
  });
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
 

    if (isNaN(formData.age) || formData.age <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7244/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      } else {
        setSuccess('Registration successful! Redirecting to login...');
        setError('');
        setTimeout(() => {
          navigate('/');
        }, 1500); 
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Create an Account</h2>
        <p className="subtitle">Please enter your details to register</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>


          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
     
 
          <div className="input-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div> 

          <button type="submit" className="login-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
