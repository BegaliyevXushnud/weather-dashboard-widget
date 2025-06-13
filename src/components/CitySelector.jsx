import React, { useState, useCallback, useEffect } from 'react';
import { debounce, fetchCitySuggestions } from '../utils/weatherUtils';

const CitySelector = ({ selectedCity, dispatch }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const predefinedCities = ['London', 'New York', 'Tokyo', 'Cairo', 'Sydney'];

  const debouncedFetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value) {
        setSuggestions([]);
        setError('');
        return;
      }
      const cities = await fetchCitySuggestions(value);
      if (cities.length === 0) {
        setError('No cities found for the search term');
      } else {
        setError('');
      }
      setSuggestions(cities);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetchSuggestions(value);
  };

  const handleSelectCity = (city) => {
    setSearch('');
    setSuggestions([]);
    setError('');
    dispatch({ type: 'CHANGE_CITY', city }); 
  };

  const handleDropdownChange = (e) => {
    const cityName = e.target.value;
    if (cityName) {
      dispatch({ type: 'CHANGE_CITY', city: cityName }); 
    }
  };

 
  const selectedIndex = suggestions.findIndex(city => city.name === (selectedCity?.name || ''));

  return (
    <div className="city-selector">
      <label htmlFor="city-select">Select City:</label>
      <select
        id="city-select"
        value={typeof selectedCity === 'string' ? selectedCity : selectedCity.name || ''}
        onChange={handleDropdownChange}
      >
        <option value="">Select a city</option>
        {predefinedCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label htmlFor="city-search">Or Search City:</label>
      <input
        id="city-search"
        type="text"
        placeholder="Search city..."
        value={search}
        onChange={handleSearch}
      />

      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <li
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleSelectCity(city)}
              className={`suggestion-option ${index === selectedIndex ? 'selected' : ''}`}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error-message">{error}</div>}
      <p>Selected City: {typeof selectedCity === 'string' ? selectedCity : selectedCity.name || 'None'}</p>
    </div>
  );
};

export default CitySelector;