const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample data
const places = [
  { id: 1, name: 'Eiffel Tower', location: { lat: 48.8584, lng: 2.2945 } },
  { id: 2, name: 'Louvre Museum', location: { lat: 48.8606, lng: 2.3376 } },
  { id: 3, name: 'Notre-Dame Cathedral', location: { lat: 48.8529, lng: 2.3500 } }
];

const challenges = [
  { id: 1, description: 'Visit 5 landmarks in the city' },
  { id: 2, description: 'Try 3 local dishes' },
  { id: 3, description: 'Take a photo at the Eiffel Tower' }
];

// Routes
app.get('/api/places', (req, res) => {
  res.json(places);
});

app.get('/api/challenges', (req, res) => {
  res.json(challenges);
});

app.post('/api/booking', (req, res) => {
  const { name, tourDate } = req.body;
  // In a real app, you’d save the booking in a database.
  res.json({ message: `Booking for ${name} on ${tourDate} confirmed!` });
});

// Start server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
