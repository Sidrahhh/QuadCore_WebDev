import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Cuisine = () => {
  const location = useLocation().state?.location; // Get the location from the state
  const [cuisines, setCuisines] = useState([]);
  
  // Example function to fetch local cuisines (you can integrate an API here)
  const fetchCuisines = (location) => {
    // Placeholder for API call or logic to get cuisines based on location
    // Here, we'll just mock it with some data based on location
    const mockCuisines = {
      "New York": ["Pizza", "Bagels", "Pastrami Sandwich"],
      "Tokyo": ["Sushi", "Ramen", "Tempura"],
      "Paris": ["Croissants", "Baguette", "Coq au Vin"]
    };
    
    // Use the location (city name or coordinates) to find cuisines
    const city = location ? location.city : "New York"; // default to "New York" if no location
    setCuisines(mockCuisines[city] || ["Local Delicacies"]);
  };

  useEffect(() => {
    if (location) {
      fetchCuisines(location);
    }
  }, [location]);

  if (!location) {
    return <div>Location data is missing.</div>;
  }

  return (
    <div>
      <h1>Local Cuisines in {location.city || "Your Location"}</h1>
      <ul>
        {cuisines.map((cuisine, index) => (
          <li key={index}>{cuisine}</li>
        ))}
      </ul>
    </div>
  );
};

export default Cuisine;
