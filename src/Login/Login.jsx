import React, { useState } from 'react';
import './Style.css' ;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log('Form submitted:', formData);
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
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;