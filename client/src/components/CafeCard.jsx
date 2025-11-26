// client/src/components/CafeCard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaMapMarkerAlt, FaWalking } from 'react-icons/fa';

const CafeCard = ({ place, isSelected, onClick }) => {
  const [address, setAddress] = useState(place.vicinity || 'Address unavailable');
  const [loadingAddr, setLoadingAddr] = useState(false);

  useEffect(() => {
    if (place.vicinity && place.vicinity !== 'Address unavailable') {
      setAddress(place.vicinity);
      return;
    }
    let isMounted = true;
    const delay = Math.random() * 2000; 
    const fetchAddress = setTimeout(() => {
      setLoadingAddr(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${place.geometry.location.lat}&lon=${place.geometry.location.lng}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.display_name) {
            setAddress(data.display_name.split(',').slice(0, 3).join(','));
          }
        })
        .catch(err => console.error(err))
        .finally(() => { if (isMounted) setLoadingAddr(false); });
    }, delay);
    return () => { isMounted = false; clearTimeout(fetchAddress); };
  }, [place]);

  const formattedDist = place.distance 
    ? `${place.distance.toFixed(1)} km` 
    : '';

  return (
    <div className={`cafe-card ${isSelected ? 'selected' : ''}`} onClick={onClick} id={`card-${place.place_id}`}>
      <div className="cafe-header">
        <span className="cafe-name">{place.name}</span>
        
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
           <span className="cafe-rating">
            {place.rating ? place.rating : 'N/A'} <FaStar color="#F39C12" />
           </span>
           
           {formattedDist && (
             <span style={{
                 fontSize: '0.75rem', 
                 color: '#27ae60', 
                 fontWeight: 'bold', 
                 marginTop: '2px',
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '3px'
             }}>
                <FaWalking /> {formattedDist}
             </span>
           )}
        </div>
      </div>
      
      <div className="cafe-meta" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left', width: '100%' }}>
        <FaMapMarkerAlt className="meta-icon" style={{ marginTop: '3px', flexShrink: 0 }} />
        {loadingAddr ? (
            <span className="loading-text" style={{ marginLeft: '6px' }}>Loading address...</span> 
        ) : (
            <span style={{ marginLeft: '6px', lineHeight: '1.4' }}>{address}</span>
        )}
      </div>
    </div>
  );
};

CafeCard.propTypes = {
  place: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default CafeCard;