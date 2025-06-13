import React from 'react';
import { convertTemp } from '../utils/weatherUtils';

const WeatherDisplay = ({ weatherData, unit }) => {
  if (!weatherData?.list?.[0]) return <div className="weather-display">No data available</div>;
  const { main, weather } = weatherData.list[0];
  const temp = convertTemp(main.temp, unit).toFixed(1);

  return (
    <div className="weather-display">
      <h2>Current Weather</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather[0].icon}.png`}
        alt={weather[0].description}
      />
      <p>{temp}°{unit}</p>
      <p>{weather[0].description}</p>
    </div>
  );
};

export default WeatherDisplay;