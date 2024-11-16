import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [culturalInfo, setCulturalInfo] = useState("");
  const [intervalIndex, setIntervalIndex] = useState(0);
  const alertShown = useRef({});  // Changed to an object to track alerts per city
  const locations = [
    { lat: 12.9234074, lng: 77.4996657, city: "Bangalore" },
    { lat: 22.2587, lng: 71.1924, city: "Gujarat" },
    { lat: 19.7515, lng: 75.7139, city: "Maharashtra" }
  ];

  // Custom icon setup
  const customIcon = L.icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const CenterMapOnMarker = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.setView([lat, lng], map.getZoom(), {
          animate: true,
        });
      }
    }, [lat, lng, map]);
    return null;
  };

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          getAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    };

    fetchLocation();
    const interval = setInterval(() => {
      setIntervalIndex((prevIndex) => (prevIndex + 1) % locations.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (locations[intervalIndex]) {
      const { lat, lng, city } = locations[intervalIndex];
      setLocation({ lat, lng });
      getAddress(lat, lng, city);
    }
  }, [intervalIndex]);

  const getAddress = async (lat, lng, city = "") => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
    
      if (data && data.display_name) {
        setAddress(data.display_name);
  
        // Only show alert for cities in the predefined locations array
        // and only if we haven't shown an alert for this city before
        if (city && !alertShown.current[city]) {
          alert(`You have moved to ${city}. Your address: ${data.display_name}`);
          fetchCulturalDetails(city);
          alertShown.current[city] = true;  // Mark this city as shown
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  
  const fetchCulturalDetails = async (city) => {
    const apiKey = "";
    const user_input = `Provide a warm greeting in the local language and a brief summary of cultural highlights for ${city}.`;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: user_input }],
          max_tokens: 150,
        }),
      });
  
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const text = data.choices[0].message['content'].trim();
        setCulturalInfo(text);
        alert(text);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching cultural details:", error);
      alert("Error getting response");
    }
  };

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Map with Your Location</h1>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CenterMapOnMarker lat={location.lat} lng={location.lng} />
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            You are here! <br /> {address} <br /> {culturalInfo}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;
