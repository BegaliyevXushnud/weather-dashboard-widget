export const geoApiOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '3931170c50mshc78ff09d1506c8cp1819b8jsn9227fa449fc3',
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
  },
};

export const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
export const WEATHER_API_KEY = '77e339745f7e4828274b8af609add4b3';

export const convertTemp = (temp, unit) => {
  if (typeof temp !== 'number' || isNaN(temp)) return 0;
  if (unit === 'C') return temp - 273.15;
  return (temp - 273.15) * 9 / 5 + 32;
};

export const calculateDailyAverages = (forecasts) => {
  if (!forecasts || !Array.isArray(forecasts)) return [];
  const daily = {};
  forecasts.forEach((item) => {
    if (!item.main || typeof item.main.temp !== 'number') return;
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!daily[date]) daily[date] = { temps: [], min: Infinity, max: -Infinity };
    daily[date].temps.push(item.main.temp);
    daily[date].min = Math.min(daily[date].min, item.main.temp);
    daily[date].max = Math.max(daily[date].max, item.main.temp);
  });
  return Object.entries(daily)
    .map(([date, data]) => ({
      date,
      avg: data.temps.length ? data.temps.reduce((sum, t) => sum + t, 0) / data.temps.length : 0,
      min: data.min === Infinity ? 0 : data.min,
      max: data.max === -Infinity ? 0 : data.max,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const calculateSummaryStats = (dailyData, unit) => {
  if (!dailyData.length) return { avg: 0, min: 0, max: 0 };
  const temps = dailyData.map((d) => convertTemp(d.avg, unit));
  const minTemps = dailyData.map((d) => convertTemp(d.min, unit));
  const maxTemps = dailyData.map((d) => convertTemp(d.max, unit));
  return {
    avg: temps.reduce((sum, t) => sum + t, 0) / temps.length || 0,
    min: Math.min(...minTemps) || 0,
    max: Math.max(...maxTemps) || 0,
  };
};

export const debounce = (func, delay) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
};

const mockWeatherData = {
  London: [
    { dt: 1697059200, main: { temp: 288 }, weather: [{ description: 'Clear', icon: '01d' }] },
    { dt: 1697145600, main: { temp: 290 }, weather: [{ description: 'Cloudy', icon: '02d' }] },
    { dt: 1697232000, main: { temp: 287 }, weather: [{ description: 'Rain', icon: '10d' }] },
  ],
  'New York': [
    { dt: 1697059200, main: { temp: 293 }, weather: [{ description: 'Cloudy', icon: '02d' }] },
    { dt: 1697145600, main: { temp: 295 }, weather: [{ description: 'Sunny', icon: '01d' }] },
    { dt: 1697232000, main: { temp: 292 }, weather: [{ description: 'Clear', icon: '01d' }] },
  ],
  Tokyo: [
    { dt: 1697145600, main: { temp: 298 }, weather: [{ description: 'Rain', icon: '10d' }] },
    { dt: 1697145600, main: { temp: 297 }, weather: [{ description: 'Rain', icon: '10d' }] },
    { dt: 1697232000, main: { temp: 299 }, weather: [{ description: 'Cloudy', icon: '02d' }] },
  ],
  Sydney: [
    { dt: 1697059200, main: { temp: 295 }, weather: [{ description: 'Sunny', icon: '01d' }] },
    { dt: 1697145600, main: { temp: 299 }, weather: [{ description: 'Clear', icon: '01d' }] },
    { dt: 1697232000, main: { temp: 297 }, weather: [{ description: 'Sunny', icon: '01d' }] },
  ],
  Cairo: [
    { dt: 1697059200, main: { temp: 303 }, weather: [{ description: 'Hot', icon: '01d' }] },
    { dt: 1697145600, main: { temp: 305 }, weather: [{ description: 'Hot', icon: '01d' }] },
    { dt: 1697232000, main: { temp: 302 }, weather: [{ description: 'Clear', icon: '01d' }] },
  ],
};

export const fetchWeather = async (location) => {
  try {
    if (typeof location === 'string' && mockWeatherData[location]) {
      return { list: mockWeatherData[location] };
    }
    const url = typeof location === 'string'
      ? `${WEATHER_API_URL}/forecast?q=${location}&appid=${WEATHER_API_KEY}`
      : `${WEATHER_API_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};

export const fetchCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${query}`,
      geoApiOptions
    );
    if (!response.ok) throw new Error('Failed to fetch city suggestions');
    const data = await response.json();
    return (
      data.data?.map((city) => ({
        name: city.city,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
      })) || []
    );
  } catch (error) {
    console.error('Geo API Error:', error.message);
    return [];
  }
};