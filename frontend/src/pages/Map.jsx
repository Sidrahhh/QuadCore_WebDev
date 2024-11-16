import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const imageUrl1 = "/explore-icon.png";
const imageUrl2 = "/challenges.png"

const Map = ({ location }) => {
  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = React.useState(location);

  useEffect(() => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 12,
      });

      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: "Local Vibes Location",
      });

      // Allow user to click on the map to set a new location
      window.google.maps.event.addListener(map, "click", (event) => {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setSelectedLocation(newLocation);
        marker.setPosition(newLocation);
      });
    }
  }, [location]);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <ul style={styles.navList}>
          
            <li style={styles.navItem}>
            <Link to="/places">
              <img
                src={imageUrl1}
                alt="explore-icon"
                style={{ height: "50px", borderRadius: "50%" }}
              />
              </Link>
            </li>
          
          <li style={styles.navItem}>
            <Link to="/challenges"><img
                src={imageUrl2}
                alt="explore-icon"
                style={{ height: "50px", borderRadius: "50%" }}
              /></Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/booking">Book Your Tour</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/cuisine" state={{ location: selectedLocation }}>
              Local Cuisine
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content area */}
      <div style={styles.mainContent}>
        <div ref={mapRef} style={styles.map}></div>
      </div>
    </div>
  );
};

// Inline styles for layout
const styles = {
  container: {
    display: "flex",
    height: "100vh", // Make sure it fills the full viewport height
  },
  sidebar: {
    width: "200px", // Sidebar width
    backgroundColor: "#f4f4f4",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  navList: {
    listStyleType: "none",
    padding: 0,
  },
  navItem: {
    marginBottom: "10px",
  },
  mainContent: {
    flex: 1, // This will make the main content fill the remaining space
    // padding: '20px',
    backgroundColor: "#fff",
    overflowY: "auto", // In case content overflows vertically
  },
  map: {
    height: "100%",
    width: "100%",
    backgroundColor: "lightblue", // This is just for the initial background
  },
};

export default Map;
