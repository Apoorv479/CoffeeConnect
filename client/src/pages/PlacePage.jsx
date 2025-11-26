// client/src/pages/PlacePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PlacePage = () => {
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Cafe Details</h2>
      <p>Please select a cafe from the Home screen map.</p>
      <Link to="/" className="btn" style={{ 
        display: 'inline-block', 
        marginTop: '1rem', 
        padding: '10px 20px', 
        backgroundColor: '#e67e22', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px' 
      }}>
        Go to Map
      </Link>
    </div>
  );
};

export default PlacePage;