import React from 'react';

const ForecastList = ({ weatherData, unit }) => {
  if (!weatherData || !Array.isArray(weatherData.list)) return <div>No forecast data available</div>;

  const dailyAverages = weatherData.list.slice(0, 5).map(item => ({
    date: new Date(item.dt * 1000).toLocaleDateString(),
    temp: Math.round((item.main.temp - 273.15) * 9 / 5 + 32), // Fahrenheit
    description: item.weather[0].description,
    icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
  }));

  return (
    <div className="forecast-list">
      {dailyAverages.map((day, index) => (
        <div key={index} className="forecast-card">
          <p>{day.date}</p>
          <img src={day.icon} alt={day.description} />
          <p>{day.temp}°{unit === 'F' ? 'F' : 'C'}</p>
          <p>{day.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ForecastList;