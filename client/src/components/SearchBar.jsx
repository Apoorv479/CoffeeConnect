// client/src/components/SearchBar.jsx
import React from 'react';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <h3>Nearby Cafes</h3>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>
        Searching 3km radius around your location
      </p>
    </div>
  );
};

export default SearchBar;