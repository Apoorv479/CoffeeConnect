// client/src/components/CafeList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import CafeCard from './CafeCard';

const CafeList = ({ places, selectedPlaceId, onSelect }) => {
  if (!places || places.length === 0) {
    return <div className="cafe-list"><p>No cafes found in this area.</p></div>;
  }

  return (
    <div className="cafe-list">
      {places.map((place) => (
        <CafeCard 
          key={place.place_id} 
          place={place} 
          isSelected={place.place_id === selectedPlaceId}
          onClick={() => onSelect(place)}
        />
      ))}
    </div>
  );
};

CafeList.propTypes = {
  places: PropTypes.arrayOf(PropTypes.object),
  selectedPlaceId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default CafeList;