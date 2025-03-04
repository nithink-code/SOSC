import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherApp.css'; // Create this CSS file

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const API_KEY = '195053dae29e2952b3834e3d8d005e95'; // Replace with your API key

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const fetchWeatherData = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${
          isCelsius ? 'metric' : 'imperial'
        }`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name.');
      setWeatherData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      fetchWeatherData();
    } else {
      setError('Please enter a city name.');
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
    if (weatherData) {
      fetchWeatherData(); //refetch data with new unit.
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getTemperature = () => {
    if (!weatherData) return null;
    return isCelsius
      ? `${Math.round(weatherData.main.temp)}°C`
      : `${Math.round(weatherData.main.temp)}°F`;
  };

  return (
    <div className={`weather-app ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Weather App</h1>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={toggleTemperatureUnit}>
        {isCelsius ? 'Switch to °F' : 'Switch to °C'}
      </button>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {getTemperature()}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} {isCelsius ? "m/s" : "mph"}</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
          />
        </div>
      )}
    </div>
  );
};

export default WeatherApp;