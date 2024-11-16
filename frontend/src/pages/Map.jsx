import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const imageUrl1 = "/explore-icon.png";
const imageUrl2 = "/challenges.png";
const imageUrl3 = "/online-booking.png";

const Map = ({ location }) => {
  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate(); // Use navigate hook to redirect
  
  const handleLogout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem("user");
    // Show logout notification
    setLogoutMessage('You have logged out successfully!');
    // Redirect the user to the login page after 1 second
    setTimeout(() => navigate("/"), 1500); // You can adjust the timing
  };

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
        <div>
          <Link to="/">
            <img style={styles.logo} src="/local.png" alt="website-logo" />
          </Link>
        </div>
        <br />
        <br />
        <ul style={styles.navList}>
          <li
            style={styles.navItem}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "visible")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "hidden")
            }
          >
            <Link to="/explore" style={styles.iconContainer}>
              <img
                src={imageUrl1}
                alt="explore-icon"
                style={{ height: "40px", borderRadius: "50%" }}
              />
              <div style={styles.tooltip}>Explore</div>
            </Link>
          </li>
          <br />
          <br />

          <li
            style={styles.navItem}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "visible")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "hidden")
            }
          >
            <Link to="/challenges" style={styles.iconContainer}>
              <img
                src={imageUrl2}
                alt="challenges"
                style={{ height: "40px", borderRadius: "50%" }}
              />
              <div style={styles.tooltip}>Challenges</div>
            </Link>
          </li>
          <br />
          <br />

          <li
            style={styles.navItem}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "visible")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector("div").style.visibility = "hidden")
            }
          >
            <Link to="/booking" style={styles.iconContainer}>
              <img
                src={imageUrl3}
                alt="online-booking"
                style={{ height: "40px", borderRadius: "50%" }}
              />
              <div style={styles.tooltip}>Online Booking</div>
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            backgroundColor: "#ff6347",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main content area */}
      <div style={styles.mainContent}>
        <div ref={mapRef} style={styles.map}></div>
      </div>

      {/* Logout Notification */}
      {logoutMessage && (
        <div style={styles.logoutNotification}>
          <p>{logoutMessage}</p>
        </div>
      )}
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
    width: "70px", // Sidebar width
    backgroundColor: "#eee0c9",
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
    position: "relative", // Ensure relative positioning for tooltip alignment
  },
  mainContent: {
    flex: 1, // This will make the main content fill the remaining space
    backgroundColor: "#fff",
    overflowY: "auto", // In case content overflows vertically
  },
  map: {
    height: "100%",
    width: "100%",
    backgroundColor: "lightblue", // This is just for the initial background
  },
  logo: {
    height: "200px",
    marginLeft: "-70px",
    marginTop: "-50px",
  },
  iconContainer: {
    position: "relative",
    display: "inline-block",
    height: "40px",
    paddingLeft: "10px",
  },
  tooltip: {
    visibility: "hidden",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    borderRadius: "5px",
    padding: "5px",
    paddingLeft: "5px",
    marginLeft: "10px",
    position: "absolute",
    zIndex: 1,
    top: "125%", // Position below the icon
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: "12px",
  },
  logoutNotification: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    zIndex: 1000,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: "16px",
  },
};

export default Map;
