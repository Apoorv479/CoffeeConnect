// client/src/context/SettingsContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // 1. Radius State (Default: 3000 meters / 3km)
  const [radius, setRadius] = useState(() => {
    const saved = localStorage.getItem('cafefinder_radius');
    return saved ? parseInt(saved, 10) : 3000;
  });

  // 2. Unit State (km vs miles - Future proofing)
  const [unit, setUnit] = useState('km');

  useEffect(() => {
    localStorage.setItem('cafefinder_radius', radius);
  }, [radius]);

  // 3. Clear Data Function
  const clearAllData = () => {
    if (window.confirm("Are you sure? This will delete all Favorites and reset settings.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <SettingsContext.Provider value={{ radius, setRadius, unit, setUnit, clearAllData }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};