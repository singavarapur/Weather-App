import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // State to manage info visibility

  const API_KEY = 'd903c1bd93c383dfc8e939a7a6e4db7e'; // Use environment variable for API key

  const fetchWeather = async (lat, lon) => {
    setError('');
    setWeatherData(null);
    setForecastData(null);
    setLoading(true);

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      setForecastData(forecastResponse.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);

    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${location}&appid=${API_KEY}`
      );

      const { lat, lon } = geoResponse.data;
      fetchWeather(lat, lon);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError('Unable to retrieve your location. Please check your settings.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo); // Toggle the visibility of the info section
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <form onSubmit={handleLocationSubmit}>
        <input
          type="text"
          placeholder="Enter location (City, Zip Code, etc.)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Get Weather</button>
      </form>
      <button onClick={getCurrentLocationWeather}>Use Current Location</button>
      <button onClick={toggleInfo}>{showInfo ? 'Hide Info' : 'Show Info'}</button>

      {loading && <div className="spinner"></div>}

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>
            Weather: {weatherData.weather[0].description} 
            <i className={`fas fa-${weatherData.weather[0].icon}`}></i>
          </p>
          <p>Humidity: {weatherData.main.humidity} %</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {forecastData && (
        <div className="forecast-info">
          <h2>5-Day Forecast</h2>
          {forecastData.list.map((forecast, index) => {
            if (index % 8 === 0) {
              return (
                <div key={forecast.dt} className="forecast-item">
                  <p>Date: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                  <p>Temperature: {forecast.main.temp} °C</p>
                  <p>Weather: {forecast.weather[0].description}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {showInfo && (
        <div className="info-section">
          <h3>About This App</h3>
          <p>This weather application allows you to check the current weather and 5-day forecast for any location.</p>
          <p>Simply enter a city name or zip code, or use your current location to get the latest weather updates.</p>
          
          <p>PM Accelerator! This platform serves as a guiding light for both aspiring and experienced Product Managers (PMs). It is designed to provide training, education, and job opportunities, fostering continuous improvement and shaping the next generation of PMs. Whether you are just starting out or have years of experience, PM Accelerator offers valuable resources to help you find new opportunities.</p>
          <p>For more Information: <a href='https://www.linkedin.com/school/pmaccelerator/'>visit Linkedin</a></p>
        </div>
      )}

      <footer>
        <p>Developed by Rathan Jayanath Singavarapu</p>
      </footer>
    </div>
  );
};

export default App;