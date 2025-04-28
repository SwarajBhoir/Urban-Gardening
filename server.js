const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MongoDB Connections
mongoose.connect('mongodb://localhost:27017/multiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Contact Message Schema (urbanGardening)
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema, 'messages');

// Define Garden Schema (urbanGardening)
const gardenSchema = new mongoose.Schema({
  name: String,
  city: String,
  zipcode: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Garden = mongoose.model('Garden', gardenSchema, 'gardens');

// Routes

// Default route: directly land on webdev.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'webdev.html'));
});

// API to add a garden
app.post('/api/gardens', async (req, res) => {
  try {
    const { name, city, zipcode, description } = req.body;
    const newGarden = new Garden({ name, city, zipcode, description });
    await newGarden.save();
    console.log(`🌱 New garden added: ${name}`);
    res.send(`Garden "${name}" added successfully!`);
  } catch (error) {
    console.error('❌ Failed to add garden:', error);
    res.status(500).send('Error adding garden.');
  }
});

// API to get all gardens
app.get('/api/gardens', async (req, res) => {
  try {
    const gardens = await Garden.find().sort({ createdAt: -1 });
    res.json(gardens);
  } catch (error) {
    console.error('❌ Error fetching gardens:', error);
    res.status(500).send('Error fetching gardens.');
  }
});

// API for contact messages
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    console.log(`📨 Contact form submitted by ${name}`);
    res.send(`Thanks for your message, ${name}!`);
  } catch (error) {
    console.error('❌ Contact save error:', error);
    res.status(500).send('Error saving message.');
  }
});

// Start the server
app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
