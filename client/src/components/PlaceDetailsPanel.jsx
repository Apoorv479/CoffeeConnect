// client/src/components/PlaceDetailsPanel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFavorites from '../hooks/useFavorites';
// Correction: 'FaGlobe' (Capital G) instead of 'Faglobe'
import { FaHeart, FaRegHeart, FaTimes, FaUtensils, FaGlobe, FaClock, FaWheelchair, FaMapMarkerAlt } from 'react-icons/fa';

const PlaceDetailsPanel = ({ place, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [fetchedAddress, setFetchedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (place) {
        setFetchedAddress(null);
        
        if (place.vicinity && place.vicinity !== "Address unavailable") {
            return;
        }

        setLoadingAddress(true);
        const { lat, lng } = place.geometry.location;
        // Nominatim API call
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
                setFetchedAddress(data.display_name);
            })
            .catch(err => console.error("Address fetch failed", err))
            .finally(() => setLoadingAddress(false));
    }
  }, [place]);

  if (!place) return null;

  const handleFavorite = () => {
    toggleFavorite(place);
  };

  const tags = place.tags || {};
  
  const formatText = (text) => {
      if (!text) return null;
      return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayAddress = fetchedAddress || 
                         (place.vicinity !== "Address unavailable" ? place.vicinity : null) || 
                         `${place.geometry.location.lat.toFixed(4)}, ${place.geometry.location.lng.toFixed(4)}`;

  return (
    <div className="details-overlay">
      <div className="details-panel">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem' }}>
          <h2 style={{maxWidth: '85%'}}>{place.name}</h2>
          <button onClick={handleFavorite} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#e74c3c' }}>
            {isFavorite(place.place_id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        
        <div style={{ margin: '1rem 0', color: '#555', fontSize: '0.95rem' }}>
            <p style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <FaMapMarkerAlt style={{ marginTop: '3px', color: '#e67e22' }} /> 
                <span>
                    {loadingAddress ? "Fetching exact address..." : displayAddress}
                </span>
            </p>

            {tags.cuisine && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <FaUtensils style={{ color: '#e67e22' }} /> 
                    {formatText(tags.cuisine)}
                </p>
            )}
        </div>

        {(tags.opening_hours || tags.website || tags.wheelchair) && (
            <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {tags.opening_hours && (
                    <p style={{ display: 'flex', gap: '8px' }}>
                        <FaClock /> <strong>Hours:</strong> {tags.opening_hours}
                    </p>
                )}

                {tags.website && (
                    <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <FaGlobe /> 
                        <a href={tags.website} target="_blank" rel="noreferrer" style={{color: '#3498db'}}>Visit Website</a>
                    </p>
                )}

                {tags.wheelchair && (
                    <p style={{ display: 'flex', gap: '8px' }}>
                        <FaWheelchair /> <strong>Wheelchair Access:</strong> {formatText(tags.wheelchair)}
                    </p>
                )}
            </div>
        )}

        {(!tags.opening_hours && !tags.website && !tags.wheelchair) && (
            <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '1rem' }}>
                Additional details like hours or website are not provided by this cafe on OpenStreetMap.
            </p>
        )}

        <div style={{ marginTop: '1.5rem' }}>
            <a 
                href={`http://googleusercontent.com/maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
            >
                Open in Google Maps for Directions
            </a>
        </div>
      </div>
    </div>
  );
};

PlaceDetailsPanel.propTypes = {
  place: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default PlaceDetailsPanel;