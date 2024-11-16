const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

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

// Path to the JSON file storing user data
const usersFile = path.join(__dirname, 'users.json');

// Helper functions for user data
const getUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Routes
app.get('/api/places', (req, res) => {
  res.json(places);
});

app.get('/api/challenges', (req, res) => {
  res.json(challenges);
});

app.post('/api/booking', (req, res) => {
  const { name, tourDate } = req.body;
  res.json({ message: `Booking for ${name} on ${tourDate} confirmed!` });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password.' });
  }

  const users = getUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found. Please sign up to create an account.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
  }

  res.status(200).json({ message: 'You have successfully logged in!' });
});

// Signup route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password.' });
  }

  const users = getUsers();
  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: 'This username is already registered. Please log in.' });
  }

  users.push({ username, password });
  saveUsers(users);

  res.status(201).json({ message: 'Your account has been created successfully!' });
});


// Start server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
