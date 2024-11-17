import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext'; // Import the ThemeContext

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Use the context to get theme and toggle function

  return (
    <button onClick={toggleTheme} style={{ cursor: 'pointer', padding: '10px', fontSize: '16px' }}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggle;
