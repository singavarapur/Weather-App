const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI=//uri here

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for weather data
const weatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }
});

// Create the Weather model
const Weather = mongoose.model('Weather', weatherSchema);

// Route to save weather data
app.post('/api/weather', async (req, res) => {
  const { location, temperature, description, date } = req.body;
  const weatherData = new Weather({ location, temperature, description, date });

  try {
    await weatherData.save();
    res.status(201).send('Weather data saved');
  } catch (err) {
    console.error('Error saving weather data:', err);
    res.status(500).send('Error saving weather data');
  }
});


app.get('/api/validate-location/:location', async (req, res) => {
  const location = req.params.location;

  try {
    const results = await Weather.find({ location: { $regex: location, $options: 'i' } });
    res.json(results.length > 0);
  } catch (err) {
    console.error('Error validating location:', err);
    res.status(500).send('Error validating location');
  }
});

// Route to retrieve weather data (optional)
app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.json(weatherData);
  } catch (err) {
    console.error('Error retrieving weather data:', err);
    res.status(500).send('Error retrieving weather data');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
