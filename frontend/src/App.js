import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Map from './pages/Map';
import Places from './pages/Places';
import Challenges from './pages/Challenges';
import Booking from './pages/Booking';
import Cuisine from './pages/Cuisine';
import Explore from "./pages/Explore";
import Food from "./pages/Food";
import Activities from "./pages/Activities";
import Landmarks from "./pages/Landmarks";
import GuidedTours from "./pages/GuidedTours";
import Leaderboard from "./pages/Leaderboard";

const App = () => {
  const defaultLocation = { lat: 40.7128, lng: -74.0060, city: "New York" }; // Example: New York City coordinates and city name
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use context for theme

  return (
    <Router>
      <header style={{ padding: "1rem", textAlign: "right" }}>
        <label className="toggle-switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/map" element={<Map location={defaultLocation} />} />
        <Route path="/places" element={<Places />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cuisine" element={<Cuisine />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/food" element={<Food />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/landmarks" element={<Landmarks />} />
        <Route path="/guided-tours" element={<GuidedTours />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
