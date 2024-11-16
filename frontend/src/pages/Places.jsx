import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({ lat: 48.8584, lng: 2.2945 }); // Default to Eiffel Tower

  useEffect(() => {
    axios.get('http://localhost:5000/api/places') // Fetching from backend
      .then(response => setPlaces(response.data))
      .catch(error => console.error('Error fetching places:', error));
  }, []);

  return (
    <div>
      <h1>Explore Local Places</h1>
      <ul>
        {places.map(place => (
          <li key={place.id} onClick={() => setSelectedPlace(place.location)}>
            {place.name}
          </li>
        ))}
      </ul>
      <Map location={selectedPlace} />
    </div>
  );
};

export default Places;
