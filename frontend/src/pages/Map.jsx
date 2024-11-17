import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import Alert from "./Alert.jsx"; // Import the custom Alert component

const imageUrl1 = "/explore-icon.png";
const imageUrl2 = "/challenges.png";
const imageUrl3 = "/online-booking.png";

const Map = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const markerRef = useRef(null);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const [culturalInfo, setCulturalInfo] = useState({
    greeting: "",
    phrases: [],
  });

  const [alertMessage, setAlertMessage] = useState(""); // State to manage alert
  const [mealNotification, setMealNotification] = useState(""); // State for meal notifications

  const alertShown = useRef({}); // Track alerts for each city
  const locations = [
    { lat: 12.9234074, lng: 77.4996657, city: "Bangalore" },
    { lat: 22.2587, lng: 71.1924, city: "Gujarat" },
    { lat: 19.7515, lng: 75.7139, city: "Maharashtra" },
  ];

  useEffect(() => {
    if (location && markerRef.current) {
      markerRef.current.openPopup(); // Open the popup when location is set
    }
  }, [location]);

  const customIcon = L.icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const handleLogout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem("user");
    // Show logout notification
    setLogoutMessage("You have logged out successfully!");
    // Redirect the user to the login page after 1 second
    setTimeout(() => navigate("/"), 1500); // You can adjust the timing
  };

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
    // Fetch current location
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

    // Cycle through locations every 10 seconds
    const interval = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * locations.length);
      const { lat, lng, city } = locations[nextIndex];
      setLocation({ lat, lng });
      getAddress(lat, lng, city);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Time-based notifications for meals (breakfast, lunch, tea, dinner)
    const mealNotifications = [
      { time: "06:00", message: "Good morning! Time for breakfast! 🍳" },
      { time: "12:00", message: "It's lunch time! 🍕" },
      { time: "16:00", message: "Tea time! ☕" },
      { time: "18:00", message: "Dinner's ready! 🍽️" },
    ];

    const shownMeals = {}; // Track shown meals to prevent repeated notifications on the same day

    const checkMealTime = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // Get "HH:MM" format
      const currentDate = now.toDateString(); // Get "Day Month Date Year"

      mealNotifications.forEach(({ time, message }) => {
        if (currentTime === time && shownMeals[time] !== currentDate) {
          setMealNotification(message);
          shownMeals[time] = currentDate; // Mark this notification as shown for today
        }
      });
    };

    // Check every minute
    const mealInterval = setInterval(checkMealTime, 60000);

    return () => clearInterval(mealInterval);
  }, []);

  const getAddress = async (lat, lng, city = "") => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        if (city && !alertShown.current[city]) {
          setAlertMessage(`You are here: ${data.display_name}`);
          fetchCulturalDetails(city);
          alertShown.current[city] = true;
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const fetchCulturalDetails = async (city) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    // Function to fetch each section individually
    const fetchSection = async (user_input) => {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: user_input }],
              max_tokens: 250,
            }),
          }
        );

        const data = await response.json();
        if (
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message
        ) {
          return data.choices[0].message["content"].trim();
        } else {
          throw new Error(
            "Unexpected response format: Missing message content"
          );
        }
      } catch (error) {
        console.error("Error fetching cultural details:", error);
        return null;
      }
    };

    try {
      // Fetch greeting
      const greetingInput = `Please provide a greeting in the local language of ${city}. Thos should be in the local script language`;
      const greeting = await fetchSection(greetingInput);

      // Fetch common phrases
      const phrasesInput = `Provide 5 common phrases in the local language of ${city} in the local script, their pronunciations along with their English translations.`;
      const phrasesResponse = await fetchSection(phrasesInput);
      const phrases = phrasesResponse
        ? phrasesResponse.split("\n").map((phrase) => {
            const [phraseText, translation] = phrase.split(" - ");
            return { phraseText, translation };
          })
        : [];

      // Fetch cultural heritage
      const culturalHeritageInput = `Describe the cultural heritage in max 20 words of ${city}, highlighting its famous landmarks, traditions, and any important cultural elements.`;
      const culturalHeritage = await fetchSection(culturalHeritageInput);

      // Update the state with the fetched data
      setCulturalInfo({
        greeting,
        phrases,
        culturalHeritage,
      });
    } catch (error) {
      setAlertMessage("Error fetching cultural details");
    }
  };

  if (!location) {
    return <div>Loading...</div>;
  }

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
              (e.currentTarget.querySelector("div").style.visibility =
                "visible")
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
              (e.currentTarget.querySelector("div").style.visibility =
                "visible")
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
              (e.currentTarget.querySelector("div").style.visibility =
                "visible")
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
            marginTop: "110px",
            marginLeft: "-12px",
            cursor: "pointer",
            width: "78px",
            backgroundColor: "#eee0c8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          {" "}
          <img src="/logout.png" alt="logout" height="40px" />
          <div style={styles.tooltip}>Logout</div>
        </button>
      </nav>

      {/* Main content area with Map */}
      <div style={styles.mainContent}>
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CenterMapOnMarker lat={location.lat} lng={location.lng} />
          <Marker
            position={[location.lat, location.lng]}
            icon={customIcon}
            ref={markerRef}
          >
            <Popup>
              <b>You are here! </b>
              <br /> {address} <br />
            </Popup>
          </Marker>
        </MapContainer>

        <div style={styles.infoCard}>
          {/* Display Greeting in Local Language */}
          <p>
            <strong>{culturalInfo.greeting.split(" - ")[0]}</strong> <br />
          </p>

          {/* 'Wanna talk to locals?' and Phrases */}
          <p>
            <strong>Learn the language!</strong>
          </p>
          <ul style={{ paddingLeft: "0", listStyleType: "none" }}>
            {culturalInfo.phrases.map((phrase, index) => (
              <li key={index}>
                {phrase.phraseText} <em>{phrase.translation}</em>
              </li>
            ))}
            <br />
          </ul>

          {/* Display Cultural Heritage Information */}
          {culturalInfo.culturalHeritage ? (
            <div>
              <strong>Cultural Heritage</strong>
              <p>{culturalInfo.culturalHeritage}</p>
            </div>
          ) : (
            <p>Loading cultural heritage information...</p>
          )}
        </div>

        {/* Show meal notification */}
        {mealNotification && (
          <Alert
            message={mealNotification}
            onClose={() => setMealNotification("")}
          />
        )}

        {/* Show custom alert if any message is set */}
        {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
        )}
        {/* Logout Notification */}
        {logoutMessage && (
          <div style={styles.logoutNotification}>
            <p>{logoutMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

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
  infoCard: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    width: "300px",
  },
};

export default Map;
