import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./LoginSignup.css";

const LoginSignup = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a logout message from navigation state
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/login' : '/signup';

    try {
      const response = await fetch(`https://quad-core-web-dev-f49v-new.vercel.app${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success messages
        setMessage(data.message);
        // Navigate to /map on successful login or signup
        setTimeout(() => navigate('/map'), 1500);
      } else {
        // Error messages
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className='submit' type="submit">
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
      {message && (
    <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
      {message}
    </p>
  )}
      <button className="switch-button" onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
        }}
      >
        {isLogin ? 'Not a user? Signup' : 'Already a user? Login'}
      </button>
    </div>
  );
};

export default LoginSignup;
