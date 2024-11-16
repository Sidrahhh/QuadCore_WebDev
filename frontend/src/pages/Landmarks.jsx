import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet CSS
import './Landmarks.css'; // Import custom Landmarks styles

const Landmarks = () => {
  const [location, setLocation] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [selectedLandmark, setSelectedLandmark] = useState(null); // New state for selected landmark

  // Custom landmark icon
  const landmarkCustomIcon = L.icon({
    iconUrl: '/landmark-icon.png', // Directly reference the image in the public folder
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Query Overpass API for nearby landmarks
        const overpassQuery = `
          [out:json];
          (
            node["tourism"="museum"](around:5000, ${latitude}, ${longitude});
            node["historic"="monument"](around:5000, ${latitude}, ${longitude});
            node["amenity"="place_of_worship"](around:5000, ${latitude}, ${longitude});
            node["tourism"="attraction"](around:5000, ${latitude}, ${longitude});
          );
          out body;
        `;
        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
          .then((response) => response.json())
          .then((data) => {
            const places = data.elements.map((place) => ({
              lat: place.lat,
              lng: place.lon,
              name: place.tags.name || 'Unnamed Landmark',
              description: place.tags.description || 'No description available',
              googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${place.lat},${place.lon}`, // Directions link
            }));
            setLandmarks(places);
          })
          .catch((error) => console.error("Error fetching landmarks:", error));
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  // Handle marker click to display information on the right side
  const handleMarkerClick = (landmark) => {
    setSelectedLandmark(landmark);
  };

  return (
    <div className="landmarks-page">
      <h1>Landmarks</h1>
      <p>Visit the most iconic landmarks and attractions nearby.</p>
      <div className="landmarks-layout">
        <div className="map-section">
          {location && (
            <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {landmarks.map((landmark, index) => (
                <Marker
                  key={index}
                  position={[landmark.lat, landmark.lng]}
                  icon={landmarkCustomIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(landmark), // Set selected landmark when clicked
                  }}
                >
                  <Popup>
                    <strong>{landmark.name}</strong><br />
                    {landmark.description}<br />
                    <a href={landmark.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions on Google Maps
                    </a>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
        <div className="info-section">
          <h2>Landmark Information</h2>
          {selectedLandmark ? (
            <div>
              <h3>{selectedLandmark.name}</h3>
              <p>{selectedLandmark.description}</p>
              <a href={selectedLandmark.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions on Google Maps
              </a>
            </div>
          ) : (
            <p>Click on a landmark to see more details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landmarks;
