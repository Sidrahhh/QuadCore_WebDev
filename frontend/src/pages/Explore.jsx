import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Explore.css"; // Import the CSS for styling
import giData from './giProducts.json'; // Import GI Products data

// Haversine formula to calculate distance in kilometers
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const Explore = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({
    city: "Bangalore",
    country: "India",
    coordinates: "12.9716, 77.5946", // Coordinates of Bangalore
  });
  const [nearbyProducts, setNearbyProducts] = useState([]);

  useEffect(() => {
    const { latitude, longitude } = { latitude: 12.9716, longitude: 77.5946 }; // Bangalore coordinates
    const WEATHER_API_KEY = "c32182ec511f9b9fc12fe9b75f7cf783"; // Replace with your OpenWeatherMap API key

    // Fetch weather data from OpenWeatherMap
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeather({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
        });
      })
      .catch((error) => console.error("Error fetching weather:", error));

    // Fetch GI Products based on nearby cities around Bangalore
    const nearby = giData.filter((item) => {
      const { latitude: cityLat, longitude: cityLon } = item.coordinates;
      const distance = getDistance(latitude, longitude, cityLat, cityLon);
      return distance <= 200; // Filter cities within 200 km of Bangalore
    });

    setNearbyProducts(nearby);
  }, []);

  const categories = [
    {
      id: 1,
      name: "Food",
      description: "Discover the best local cuisine.",
      path: "/food",
      icon: "/food.png",
    },
    {
      id: 2,
      name: "Activities",
      description: "Explore fun activities in the area.",
      path: "/activities",
      icon: "/activities.png",
    },
    {
      id: 3,
      name: "Landmarks",
      description: "Visit famous local landmarks.",
      path: "/landmarks",
      icon: "/landmarks.png",
    },
    {
      id: 4,
      name: "Guided Tours",
      description: "Book tours with expert guides.",
      path: "/guided-tours",
      icon: "/guided-tours.png",
    },
    {
      id: 5,
      name: "GI Products",
      description: "Explore authentic GI (Geographical Indication) products.",
      path: "/gi-products",
      icon: "gi-products.png",
    },
  ];

  return (
    <div className="full-explore">
      <h1>Location</h1>
      <div className="weather">
        Weather Information
        {location && weather ? (
          <div className="weather-details">
            <p>
              <strong>Location:</strong> {location.coordinates}, {location.country}
            </p>
            <p><strong>Temperature:</strong> {weather.temperature}°C</p>
            <p><strong>Weather:</strong> {weather.description}</p>
            <p><strong>Humidity:</strong> {weather.humidity}%</p>
            <p><strong>Wind Speed:</strong> {weather.windSpeed} m/s</p>
          </div>
        ) : (
          <p>Loading weather and location data...</p>
        )}
      </div>

      <div className="explore-container">
        <h1>Explore Local Highlights</h1>
        <div className="explore-cards">
          {categories.map((category) => (
            <Link key={category.id} to={category.path} className="explore-card">
              <img
                src={category.icon}
                alt={`${category.name} icon`}
                className="explore-icon"
              />
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="gi-products-container">
        {nearbyProducts.length > 0 ? (
          <div>
            <h2>GI Products in Nearby Areas</h2>
            {nearbyProducts.map((item, index) => (
              <div key={index} className="gi-products">
                <h3>{item.city}, {item.state}</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {item.products.map((product, idx) => (
                    <li key={idx}>{product}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No nearby GI products found.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
