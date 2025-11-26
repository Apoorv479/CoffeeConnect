// client/src/pages/SettingsPage.jsx
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FaCog, FaTrashAlt, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';

const SettingsPage = () => {
  const { radius, setRadius, clearAllData } = useSettings();

  const handleRadiusChange = (e) => {
    setRadius(parseInt(e.target.value, 10));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your CafeFinder experience</p>
      </div>

      <div className="settings-section">
        <h2><FaMapMarkedAlt style={{marginRight: '10px'}}/> Search Preferences</h2>
        
        <div className="setting-item">
          <label>Search Radius ({radius / 1000} km)</label>
          <div className="range-wrapper">
            <input 
              type="range" 
              min="1000" 
              max="10000" 
              step="1000" 
              value={radius} 
              onChange={handleRadiusChange}
              className="range-slider"
            />
            <div className="range-labels">
              <span>1km</span>
              <span>5km</span>
              <span>10km</span>
            </div>
          </div>
          <p className="setting-desc">Adjust how far we search for cafes from your location.</p>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2><FaCog style={{marginRight: '10px'}}/> Data Management</h2>
        
        <div className="setting-item">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <strong>Clear App Data</strong>
              <p className="setting-desc">Remove all favorites and reset settings.</p>
            </div>
            <button onClick={clearAllData} className="btn-danger">
              <FaTrashAlt style={{marginRight: '8px'}}/> Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;