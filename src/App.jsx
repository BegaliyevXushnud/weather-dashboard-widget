import React from 'react';
import WeatherWidget from './components/WeatherWidget';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <WeatherWidget />
      </div>
    </ThemeProvider>
  );
}

export default App;