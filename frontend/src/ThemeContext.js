import React, { createContext, useState, useEffect } from "react";

// Create a Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // State to manage theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get the saved theme from localStorage or default to light mode
    return localStorage.getItem("theme") === "dark";
  });

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light"); // Save preference
      return newMode;
    });
  };

  // Apply the theme to the body
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
