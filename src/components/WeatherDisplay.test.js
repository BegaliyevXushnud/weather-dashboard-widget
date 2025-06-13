import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherDisplay from './WeatherDisplay';

describe('WeatherDisplay', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<WeatherDisplay weatherData={{ list: [{ main: { temp: 288 } }] }} unit="F" />);
    expect(asFragment()).toMatchSnapshot();
  });
});