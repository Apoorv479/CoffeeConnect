// client/src/pages/AboutPage.jsx
import React from 'react';
import { FaCoffee, FaMapMarkedAlt, FaHeart, FaCode, FaLeaf } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-icon-wrapper">
          <FaCoffee />
        </div>
        <h1>About CafeFinder</h1>
        <p className="hero-subtitle">
          Your ultimate companion for finding the perfect brew, wherever you are.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          We believe that finding a great cup of coffee shouldn't be hard. Whether you're in a new city 
          or just exploring your local neighborhood, CafeFinder connects you with the best caffeine spots/restaurants
          instantly using advanced geolocation technology.
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <FaMapMarkedAlt className="feature-icon" />
          <h3>Smart Detection</h3>
          <p>Instantly detects your location to find top-rated cafes within a 5km radius.</p>
        </div>
        
        <div className="feature-card">
          <FaLeaf className="feature-icon" />
          <h3>Open Data</h3>
          <p>Powered by OpenStreetMap and Overpass API, providing community-driven data.</p>
        </div>

        <div className="feature-card">
          <FaHeart className="feature-icon" />
          <h3>Save Favorites</h3>
          <p>Love a spot? Save it to your personal collection with a single click.</p>
        </div>
      </div>

      {/* Tech Stack (Portfolio touch) */}
      <div className="tech-stack">
        <h3><FaCode style={{marginRight: '8px'}}/> Built with Modern Tech</h3>
        <div className="tags">
          <span className="tag">React</span>
          <span className="tag">Vite</span>
          <span className="tag">Leaflet</span>
          <span className="tag">OpenStreetMap</span>
          <span className="tag">Geolocation API</span>
        </div>
      </div>
      
      <div className="about-footer">
        <p>Designed & Developed with ❤️ by <strong>Apoorv</strong></p>
      </div>
    </div>
  );
};

export default AboutPage;