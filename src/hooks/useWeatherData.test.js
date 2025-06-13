import { renderHook, act } from '@testing-library/react-hooks';
import useWeatherData from './useWeatherData'; // Yo'lni moslashtiring
import { fetchWeather } from '../utils/weatherUtils';

jest.mock('../utils/weatherUtils', () => ({
  fetchWeather: jest.fn(),
}));

describe('useWeatherData Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetchWeather.mockResolvedValue({
      list: [{ dt: 1697059200, main: { temp: 288 } }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useWeatherData());
    expect(result.current.state.selectedCity).toBe('London');
    expect(result.current.state.weatherData).toBeNull();
    expect(result.current.state.unit).toBe('F');
    expect(result.current.state.error).toBe('');
    expect(result.current.state.loading).toBe(false);
  });

  it('updates city on dispatch', () => {
    const { result } = renderHook(() => useWeatherData());
    act(() => {
      result.current.dispatch({ type: 'CHANGE_CITY', city: 'New York' });
    });
    expect(result.current.state.selectedCity).toBe('New York');
    expect(result.current.state.loading).toBe(true);
    act(() => {
      jest.runAllTimers();
    });
    expect(fetchWeather).toHaveBeenCalledWith('New York');
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.weatherData).toEqual({
      list: [{ dt: 1697059200, main: { temp: 288 } }],
    });
  });
});