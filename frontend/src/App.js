import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Places from './pages/Places';
import Challenges from './pages/Challenges';
import Booking from './pages/Booking';
import Cuisine from './pages/Cuisine';  // New Cuisine page import

const App = () => {
  const defaultLocation = { lat: 40.7128, lng: -74.0060, city: "New York" };  // Example: New York City coordinates and city name

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map location={defaultLocation} />} />
        <Route path="/places" element={<Places />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cuisine" element={<Cuisine />} />
      </Routes>
    </Router>
  );
};

export default App;
