import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS
import './Food.css'; // Import custom Food styles

const Food = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  // Custom food icon - reference from public folder
  const foodCustomIcon = L.icon({
    iconUrl: '/food-icon.png', // Directly reference the image in the public folder
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Query Overpass API for nearby restaurants
        const overpassQuery = `
          [out:json];
          (
            node["amenity"="restaurant"](around:1000, ${latitude}, ${longitude});
          );
          out body;
        `;
        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
          .then((response) => response.json())
          .then((data) => {
            const places = data.elements.map((place) => ({
              lat: place.lat,
              lng: place.lon,
              name: place.tags.name || 'Unnamed Restaurant',
              googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${place.lat},${place.lon}`, // Directions link
            }));
            setRestaurants(places);
          })
          .catch((error) => console.error("Error fetching restaurants:", error));
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  return (
    <div className="food-page">
      <h1>Food</h1>
      <p>Explore the best local food around you.</p>
      <div className="restaurant-cards">
        {restaurants.map((restaurant, index) => (
          <div className="restaurant-card" key={index}>
            <h3>{restaurant.name}</h3>
            <MapContainer center={[restaurant.lat, restaurant.lng]} zoom={15} style={{ height: "200px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[restaurant.lat, restaurant.lng]} icon={foodCustomIcon}>
                <Popup>
                  <strong>{restaurant.name}</strong><br />
                  <a href={restaurant.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Get Directions on Google Maps
                  </a>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
