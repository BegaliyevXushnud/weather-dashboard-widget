import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SettingsPanel = ({ unit, dispatch }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="settings-panel">
      <label>
        Unit:
        <select
          value={unit}
          onChange={(e) => dispatch({ type: 'TOGGLE_UNIT', payload: e.target.value })}
        >
          <option value="C">Celsius</option>
          <option value="F">Fahrenheit</option>
        </select>
      </label>
      <button onClick={toggleTheme}>
        Toggle Theme ({theme === 'light' ? 'Dark' : 'Light'})
      </button>
    </div>
  );
};

export default SettingsPanel;