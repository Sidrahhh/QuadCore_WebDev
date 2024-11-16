import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/challenges') // Fetching from backend
      .then(response => setChallenges(response.data))
      .catch(error => console.error('Error fetching challenges:', error));
  }, []);

  return (
    <div>
      <h1>Challenges</h1>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge.id}>{challenge.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Challenges;
