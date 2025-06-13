import { useReducer, useEffect } from 'react';
import { fetchWeather, fetchCitySuggestions } from '../utils/weatherUtils';

const initialState = {
  selectedCity: 'London', // Default shahar
  weatherData: null,
  unit: 'F',
  error: '',
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_CITY':
      return { ...state, selectedCity: action.city, loading: true, error: '' };
    case 'FETCH_WEATHER_SUCCESS':
      return { ...state, weatherData: action.payload, loading: false };
    case 'FETCH_WEATHER_ERROR':
      return { ...state, error: action.payload, loading: false, weatherData: null };
    case 'TOGGLE_UNIT':
      return { ...state, unit: state.unit === 'F' ? 'C' : 'F' };
    default:
      return state;
  }
};

const useWeatherData = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.selectedCity) {
      dispatch({ type: 'FETCH_WEATHER' });
      fetchWeather(state.selectedCity)
        .then((data) => dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: data }))
        .catch((error) => dispatch({ type: 'FETCH_WEATHER_ERROR', payload: error.message }));
    }
  }, [state.selectedCity]);

  return { state, dispatch };
};

export default useWeatherData;