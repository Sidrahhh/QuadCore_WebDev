// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import MapPage from './pages/MapPage';
import LandmarksPage from './pages/LandmarksPage'; // Import the LandmarksPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/landmarks" element={<LandmarksPage />} /> {/* Add LandmarksPage route */}
      </Routes>
    </Router>
  );
}

export default App;
