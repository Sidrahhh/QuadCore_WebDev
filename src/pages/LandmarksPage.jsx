// src/pages/Landmarks.jsx (or wherever your component is located)
import React, { useState, useEffect, useRef } from "react"; // Import React and hooks
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS
import markerIconPng from "leaflet/dist/images/marker-icon.png"; // Current Location Icon
import landmarkIcon from './landmark-icon.png'; // Replace with your custom landmark icon

const Landmarks = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [landmarks, setLandmarks] = useState([]);
  const [weather, setWeather] = useState(null);
  const alertShown = useRef(false);

  // Create a custom icon for landmarks
  const landmarkCustomIcon = L.icon({
    iconUrl: landmarkIcon, // Custom icon for landmarks
    iconSize: [32, 32], // Adjust size of the landmark icon
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Create a custom icon for the current location
  const customIcon = L.icon({
    iconUrl: markerIconPng, // Replace with your custom icon path if needed
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  // Fetch current location, address, and weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Fetch address from OpenStreetMap's Nominatim API
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.display_name) {
              setAddress(data.display_name);
              if (!alertShown.current) {
                alert(`Your address: ${data.display_name}`);
                alertShown.current = true;
              }
            }
          })
          .catch((error) => console.error("Geocoding error:", error));

        // Fetch weather data from OpenWeatherMap API
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.main) {
              setWeather({
                temperature: data.main.temp,
                description: data.weather[0].description,
              });
            }
          })
          .catch((error) => console.error("Weather fetching error:", error));

        // Fetch nearby landmarks from Overpass API
        fetch(
          `https://overpass-api.de/api/interpreter?data=[out:json];(node["tourism"="museum"](around:5000,${latitude},${longitude});node["historic"="monument"](around:5000,${latitude},${longitude});node["amenity"="place_of_worship"](around:5000,${latitude},${longitude});node["tourism"="attraction"](around:5000,${latitude},${longitude}););out;`
        )
          .then((response) => response.json())
          .then((data) => {
            const places = data.elements.map((element) => ({
              lat: element.lat,
              lon: element.lon,
              name: element.tags.name || "Unnamed Landmark",
              type: element.tags.tourism || element.tags.historic || "Unknown",
              description: element.tags.description || "No description available",
              address: element.tags.address || "No address available",
            }));
            setLandmarks(places);
          })
          .catch((error) => console.error("Landmark fetching error:", error));
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Map with Your Location, Weather, and Nearby Landmarks</h1>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Current Location Marker */}
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            You are here! <br /> {address} <br />
            {weather && (
              <div>
                Temperature: {weather.temperature}°C <br />
                Weather: {weather.description}
              </div>
            )}
          </Popup>
        </Marker>

        {/* Landmarks Markers */}
        {landmarks.map((landmark, index) => {
          const landmarkUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${landmark.lat},${landmark.lon}&travelmode=driving`;
          
          return (
            <Marker
              key={index}
              position={[landmark.lat, landmark.lon]}
              icon={landmarkCustomIcon}
            >
              <Popup>
                <strong>{landmark.name}</strong> <br />
                Type: {landmark.type} <br />
                Description: {landmark.description} <br />
                Address: {landmark.address} <br />
                Latitude: {landmark.lat}, Longitude: {landmark.lon} <br />
                <a href={landmarkUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions to this Landmark
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Landmarks;
