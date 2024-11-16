import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
      const response = await fetch(`http://localhost:5000${url}`, {
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
    <div style={{ textAlign: 'center', margin: '2rem' }}>
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} style={{ margin: '1rem auto', maxWidth: '300px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ padding: '0.5rem', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: '0.5rem', width: '100%' }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
      <p
        style={{
          marginTop: '1rem',
          color: message.includes('successfully') ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {message}
      </p>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
        }}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default LoginSignup;
