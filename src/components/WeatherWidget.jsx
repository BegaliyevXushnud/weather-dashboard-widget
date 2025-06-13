import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import useWeatherData from '../hooks/useWeatherData';
import CitySelector from './CitySelector.jsx';
import WeatherDisplay from './WeatherDisplay.jsx';
import ForecastList from './ForecastList.jsx';
import DataVisualization from './DataVisualization.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const WeatherWidget = () => {
  const [activeTab, setActiveTab] = useState('current');
  const { state, dispatch } = useWeatherData();
  const { theme } = useContext(ThemeContext);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 300);
    return () => clearTimeout(timer);
  }, [state.selectedCity]);

  return (
    <div className={`weather-widget theme-${theme} ${fade ? 'fade' : ''} ${state.loading ? 'loading' : ''}`}>
      <ErrorBoundary>
        <div className="tabs">
          <button
            className={activeTab === 'current' ? 'active' : ''}
            onClick={() => setActiveTab('current')}
          >
            Current Weather
          </button>
          <button
            className={activeTab === 'forecast' ? 'active' : ''}
            onClick={() => setActiveTab('forecast')}
          >
            Forecast
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
        {state.error && <div className="error-message">{state.error}</div>}
        {state.loading && <div className="loading-spinner"></div>}
        <CitySelector selectedCity={state.selectedCity} dispatch={dispatch} />
        {activeTab === 'current' && !state.loading && (
          <WeatherDisplay weatherData={state.weatherData} unit={state.unit} />
        )}
        {activeTab === 'forecast' && !state.loading && (
          <ForecastList weatherData={state.weatherData} unit={state.unit} />
        )}
        {activeTab === 'stats' && !state.loading && (
          <DataVisualization weatherData={state.weatherData} unit={state.unit} />
        )}
        <SettingsPanel unit={state.unit} dispatch={dispatch} />
      </ErrorBoundary>
    </div>
  );
};

export default WeatherWidget;