import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import activitiesData from "./weatherActivities.json"; // Import the JSON data
import "./Activities.css";

const Activities = () => {
  const [weather, setWeather] = useState(null);
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [defaultActivities, setDefaultActivities] = useState(
    activitiesData.default.activities
  ); // Default activities
  const [location, setLocation] = useState(null); // Store the user's location
  const navigate = useNavigate();

  // Get the user's geolocation
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: 21.2181,
              longitude: 149.9003,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Optionally set to default location or handle error
            setLocation({
              latitude: 37.7749, // Default to San Francisco if location is not available
              longitude: -122.4194,
            });
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setLocation({
          latitude: 37.7749, // Default to San Francisco if geolocation is not supported
          longitude: -122.4194,
        });
      }
    };

    getLocation();
  }, []);

  // Fetch weather data from OpenWeather API when location is available
  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=c32182ec511f9b9fc12fe9b75f7cf783`
          );
          const data = await response.json();
          const weatherCondition = data.weather[0].description.toLowerCase();
          const temperature = data.main.temp;
          setWeather({ description: weatherCondition, temperature });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeather();
    }
  }, [location]);

  // Check for activities based on weather
  useEffect(() => {
    if (weather && location) {
      // Match weather to activity category
      const weatherType = weather.description.includes("clear")
        ? "clear"
        : weather.description.includes("rain")
        ? "rain"
        : weather.description.includes("cloud")
        ? "cloud"
        : "default"; // Default category for no matching weather

      const activitiesForWeather =
        activitiesData[weatherType]?.activities || [];

      const findNearbyActivities = async () => {
        const activitiesWithLocations = [];

        for (const activity of activitiesForWeather) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${activity.name}&lat=${location.latitude}&lon=${location.longitude}&radius=50000`
          );
          const locations = await response.json();

          if (locations.length > 0) {
            activitiesWithLocations.push({
              ...activity,
              locations,
            });
          }
        }

        // If no activities with locations are found, set default activities
        if (activitiesWithLocations.length === 0) {
          setSuggestedActivities([]);
        } else {
          setSuggestedActivities(activitiesWithLocations);
        }
      };

      findNearbyActivities();
    }
  }, [weather, location]);

  const handleActivityClick = (activity) => {
    navigate("/booking", { state: { activity } });
  };

  return (
    <div>
      <h1>Recommended Activities</h1>
      {weather ? (
        <div className="weather">
          <h2>{location.city}</h2>
          {location && weather ? (
            <div className="weather-details">
              <div className="weather-details-box0"></div>
              <div className="weather-details-box1">
                <div className="weather-details-box10">
                  <img
                    src="/weather-icon.png"
                    alt="weather-icon"
                    height="200px"
                  />
                </div>
                <div className="weather-details-box11">
                  {weather.temperature}
                </div>
                <div className="weather-details-box12">°C</div>
              </div>
              <div className="weather-details-box2">
                <br />
                <div className="weather-details-box21">
                  <p>
                    <strong>Weather:</strong> {weather.description}
                  </p>
                </div>
                <div className="weather-details-box22">
                  <p>
                    <strong>Humidity:</strong> {weather.humidity}%
                  </p>
                </div>
                <div className="weather-details-box23">
                  <p>
                    <strong>Wind Speed:</strong> {weather.windSpeed} m/s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading weather and location data...</p>
          )}
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
      {location ? <p></p> : <p>Detecting your location...</p>}
      <div className="activities-container">
        {suggestedActivities.length > 0 ? (
          suggestedActivities.map((activity, idx) => (
            <div className="activity-card" key={idx}>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              {activity.locations && activity.locations.length > 0 && (
                <p>
                  Nearby Location:{" "}
                  {activity.locations[0].display_name || "Unknown location"}
                </p>
              )}
              <Link to="/booking">
              <button onClick={() => handleActivityClick(activity)}>
                Book this Activity
              </button></Link>
            </div>
          ))
        ) : (
          <div className="no-activities-message">
            <p>No nearby activities suggested for the current weather...</p>
            <p>Stay at home!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  noActivitiesMessage: {
    textAlign: "center",
    fontSize: "24px",
    marginTop: "50px",
    color: "#333",
  },
};

export default Activities;
