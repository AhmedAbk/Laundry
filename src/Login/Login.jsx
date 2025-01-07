import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7244/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
        toast.error(errorData.message || 'Login failed. Please try again.');
      } else {
        const data = await response.json();
        toast.success('Login successful! Welcome back.');
        setError('');
        setTimeout(() => {
          navigate('/Laundries');
        }, 1500);
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      toast.error('An error occurred during login. Please try again later.');
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
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your details to sign in</p>
        
        <form onSubmit={handleSubmit}>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        {/* Add Link to register page */}
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Not a user yet? <Link to="/register" style={{ color: '#3b82f6' }}>Register here</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
