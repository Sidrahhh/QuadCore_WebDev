import React from 'react';
import { Link } from 'react-router-dom';

// Replace this with your image URL (either local or from the web)
const imageUrl = '/local.png';

const Home = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img 
        src={imageUrl} 
        alt="Local Vibes" 
        style={{ width: '100%', height: 'auto', maxWidth: '600px' }} 
      />
      <br />
      <Link to="/map">
        <button 
          className='start-button' 
          style={{
            padding: '10px 20px', 
            fontSize: '16px', 
            marginTop: '20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer'
          }}
        >
          Start Exploring
        </button>
      </Link>
    </div>
  );
};

export default Home;
