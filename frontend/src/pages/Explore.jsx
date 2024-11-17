import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Explore.css"; // Import the CSS for styling
import giData from "./giProducts.json"; // Import GI Products data

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
    coordinates: "12.9716, 77.5946", // Default coordinates (will be updated)
  });
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [showGiProducts, setShowGiProducts] = useState(false); // State to toggle visibility of GI Products container

  // Reference to the GI products container for scrolling
  const giProductsRef = useRef(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords; // Get latitude and longitude from geolocation
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

            // Set location data (city, country, and coordinates)
            setLocation({
              city: data.name,
              country: data.sys.country,
              coordinates: `${latitude}, ${longitude}`,
            });

            // Fetch GI Products based on nearby cities around the user's location
            const nearby = giData.filter((item) => {
              const { latitude: cityLat, longitude: cityLon } =
                item.coordinates;
              const distance = getDistance(
                latitude,
                longitude,
                cityLat,
                cityLon
              );
              return distance <= 200; // Filter cities within 200 km of the current location
            });

            setNearbyProducts(nearby);
          })
          .catch((error) => console.error("Error fetching weather:", error));
      },
      (error) => {
        console.error("Error getting location:", error);
        // Handle error or fallback location (Bangalore in this case)
        setLocation({
          city: "Bangalore",
          country: "India",
          coordinates: "12.9716, 77.5946",
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []); // Empty dependency array to run once on mount

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
      path: "#",
      icon: "gi-products.png",
      onClick: (e) => handleGiProductsClick(e),
    },
  ];

  const handleGiProductsClick = (e) => {
    e.preventDefault(); // Prevent default link navigation
    setShowGiProducts(!showGiProducts); // Toggle visibility of GI Products container

    // Scroll to the GI Products container
    if (giProductsRef.current) {
      giProductsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Ensures the element is aligned at the top of the viewport
        inline: "nearest", // Ensures the element is scrolled into view horizontally if necessary
      });
    }
  };

  return (
    <div className="full-explore">
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
              <div className="weather-details-box11">{weather.temperature}</div>
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
      <br />
      <h1>Explore Local Highlights</h1>
      <div className="explore-cards">
        {categories.map((category) => (
          <div
            key={category.id}
            className="explore-card"
            onClick={category.id === 5 ? category.onClick : undefined} // Only handle GI Products click
          >
            {category.id === 5 ? (
              // GI Products card without Link
              <>
                <img
                  src={category.icon}
                  alt={`${category.name} icon`}
                  className="explore-icon"
                />
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </>
            ) : (
              // All other cards wrapped in Link
              <Link
                to={category.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={category.icon}
                  alt={`${category.name} icon`}
                  className="explore-icon"
                />
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </Link>
            )}
          </div>
        ))}
      </div>
      <br /> <br />
      <div
        className="gi-products-container"
        ref={giProductsRef} // Reference to the GI products container
        style={{ display: showGiProducts ? "block" : "none" }} // Toggle visibility
      >
        {nearbyProducts.length > 0 ? (
          <div>
            <h2>GI Products in Nearby Areas</h2>
            {nearbyProducts.map((item, index) => (
              <div key={index} className="gi-products">
                <h3>
                  {item.city}, {item.state}
                </h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>
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

// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import "./Explore.css"; // Import the CSS for styling
// import giData from "./giProducts.json"; // Import GI Products data

// // Haversine formula to calculate distance in kilometers
// const getDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in km
//   return distance;
// };

// const Explore = () => {
//   const [weather, setWeather] = useState(null);
//   const [location, setLocation] = useState({
//     city: "Bangalore",
//     country: "India",
//     coordinates: "12.9716, 77.5946", // Default coordinates (will be updated)
//   });
//   const [nearbyProducts, setNearbyProducts] = useState([]);
//   const [showGiProducts, setShowGiProducts] = useState(false); // State to toggle visibility of GI Products container
//   const [expandedCity, setExpandedCity] = useState(null);
//   // Reference to the GI products container for scrolling
//   const giProductsRef = useRef(null);

//   useEffect(() => {
//     // Get user's current location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords; // Get latitude and longitude from geolocation
//         const WEATHER_API_KEY = "c32182ec511f9b9fc12fe9b75f7cf783"; // Replace with your OpenWeatherMap API key

//         // Fetch weather data from OpenWeatherMap
//         fetch(
//           `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             setWeather({
//               temperature: data.main.temp,
//               humidity: data.main.humidity,
//               windSpeed: data.wind.speed,
//               description: data.weather[0].description,
//             });

//             // Set location data (city, country, and coordinates)
//             setLocation({
//               city: data.name,
//               country: data.sys.country,
//               coordinates: `${latitude}, ${longitude}`,
//             });

//             // Fetch GI Products based on nearby cities around the user's location
//             const nearby = giData.filter((item) => {
//               const { latitude: cityLat, longitude: cityLon } =
//                 item.coordinates;
//               const distance = getDistance(
//                 latitude,
//                 longitude,
//                 cityLat,
//                 cityLon
//               );
//               return distance <= 200; // Filter cities within 200 km of the current location
//             });

//             setNearbyProducts(nearby);
//           })
//           .catch((error) => console.error("Error fetching weather:", error));
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         // Handle error or fallback location (Bangalore in this case)
//         setLocation({
//           city: "Bangalore",
//           country: "India",
//           coordinates: "12.9716, 77.5946",
//         });
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
//   }, []); // Empty dependency array to run once on mount

//   const categories = [
//     {
//       id: 1,
//       name: "Food",
//       description: "Discover the best local cuisine.",
//       path: "/food",
//       icon: "/food.png",
//     },
//     {
//       id: 2,
//       name: "Activities",
//       description: "Explore fun activities in the area.",
//       path: "/activities",
//       icon: "/activities.png",
//     },
//     {
//       id: 3,
//       name: "Landmarks",
//       description: "Visit famous local landmarks.",
//       path: "/landmarks",
//       icon: "/landmarks.png",
//     },
//     {
//       id: 4,
//       name: "Guided Tours",
//       description: "Book tours with expert guides.",
//       path: "/guided-tours",
//       icon: "/guided-tours.png",
//     },
//     {
//       id: 5,
//       name: "GI Products",
//       description: "Explore authentic GI (Geographical Indication) products.",
//       path: "#",
//       icon: "gi-products.png",
//       onClick: (e) => handleGiProductsClick(e),
//     },
//   ];

//   const handleGiProductsClick = (e) => {
//     e.preventDefault(); // Prevent default link navigation
//     setShowGiProducts(!showGiProducts); // Toggle visibility of GI Products container

//     // Scroll to the GI Products container
//     if (giProductsRef.current) {
//       giProductsRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start", // Ensures the element is aligned at the top of the viewport
//         inline: "nearest", // Ensures the element is scrolled into view horizontally if necessary
//       });
//     }
//   };

//   const toggleCityProducts = (cityIndex) => {
//     setExpandedCity((prevCity) => (prevCity === cityIndex ? null : cityIndex));
//   };

//   return (
//     <div className="full-explore">
//       <div className="weather">
//         <h2>{location.city}</h2>
//         {location && weather ? (
//           <div className="weather-details">
//             <div className="weather-details-box0"></div>
//             <div className="weather-details-box1">
//               <div className="weather-details-box10">
//                 <img
//                   src="/weather-icon.png"
//                   alt="weather-icon"
//                   height="200px"
//                 />
//               </div>
//               <div className="weather-details-box11">{weather.temperature}</div>
//               <div className="weather-details-box12">°C</div>
//             </div>
//             <div className="weather-details-box2">
//               <br />
//               <div className="weather-details-box21">
//                 <p>
//                   <strong>Weather:</strong> {weather.description}
//                 </p>
//               </div>
//               <div className="weather-details-box22">
//                 <p>
//                   <strong>Humidity:</strong> {weather.humidity}%
//                 </p>
//               </div>
//               <div className="weather-details-box23">
//                 <p>
//                   <strong>Wind Speed:</strong> {weather.windSpeed} m/s
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p>Loading weather and location data...</p>
//         )}
//       </div>

//       <br />
//       <div className="explore-container">
//         <h1>Explore Local Highlights</h1>
//         <div className="explore-cards">
//           {categories.map((category) => (
//             <div
//               key={category.id}
//               className="explore-card"
//               onClick={category.onClick || undefined}
//             >
//               <img
//                 src={category.icon}
//                 alt={`${category.name} icon`}
//                 className="explore-icon"
//               />
//               <h2>{category.name}</h2>
//               <p>{category.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <br /> <br />
//       <div
//         className="gi-products-container"
//         ref={giProductsRef} // Reference to the GI products container
//         style={{ display: showGiProducts ? "block" : "none" }} // Toggle visibility
//       >
//         {nearbyProducts.length > 0 ? (
//           <div>
//             <h2>GI Products in Nearby Areas</h2>
//             {nearbyProducts.map((item, index) => (
//               <div key={index} className="gi-products">
//                 <button onClick={() => toggleCityProducts(index)}><h3>
//                   {item.city}, {item.state}
//                 </h3></button>
//                 {expandedCity === index && (
//                   <ul style={{ listStyleType: "none", padding: 0 }}>
//                     {item.products.map((product, idx) => (
//                       <li key={idx}>{product}</li>
//                     ))}
//                   </ul>
//                 )}
//                 <br />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No nearby GI products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Explore;
