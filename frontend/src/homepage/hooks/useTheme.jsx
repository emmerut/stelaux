import React, { createContext, useState, useContext, useEffect } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() =>
    
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "light"
      : window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
  );
  useEffect(() => {
    const theme = isLightMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode); 
  };
  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);