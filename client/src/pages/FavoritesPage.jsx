// client/src/pages/FavoritesPage.jsx
import React, { useState } from 'react';
import useFavorites from '../hooks/useFavorites';
import useGeolocation from '../hooks/useGeolocation';
import CafeCard from '../components/CafeCard';
import PlaceDetailsPanel from '../components/PlaceDetailsPanel';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaHeartBroken, FaArrowLeft, FaLocationArrow } from 'react-icons/fa';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { location } = useGeolocation(); // Live Location
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);

  // --- Helper: Distance Formula (Haversine) ---
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c;
  };

  const handleRemove = (e, place) => {
    e.stopPropagation(); 
    if (window.confirm(`Remove "${place.name}" from favorites?`)) {
      toggleFavorite(place);
      if (selectedPlace && selectedPlace.place_id === place.place_id) {
        setSelectedPlace(null);
      }
    }
  };

  const openInMaps = (e, place) => {
    e.stopPropagation();
    const { lat, lng } = place.geometry.location;
    const url = `http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="favorites-container">
      <div className="fav-header">
        <h1>My Saved Cafes</h1>
        <p>{favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <FaHeartBroken className="empty-icon" />
          <h2>No favorites yet</h2>
          <p>Start exploring and save your favorite coffee spots!</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <FaArrowLeft style={{ marginRight: '8px' }}/> Go to Map
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((place) => {
            // Live Distance Calculation
            let liveDistance = null;
            if (location && place.geometry && place.geometry.location) {
               liveDistance = getDistance(
                 location.lat, 
                 location.lng, 
                 place.geometry.location.lat, 
                 place.geometry.location.lng
               );
            }

            // Create a temporary object with updated distance
            const placeWithDist = { 
              ...place, 
              distance: liveDistance
            };

            return (
              <div key={place.place_id} className="fav-card-wrapper">
                <CafeCard 
                  place={placeWithDist} 
                  onClick={() => setSelectedPlace(place)} 
                />
                
                <button 
                  className="delete-btn" 
                  onClick={(e) => handleRemove(e, place)}
                  title="Remove"
                >
                  <FaTrash />
                </button>

                <button 
                  className="maps-btn" 
                  onClick={(e) => openInMaps(e, place)}
                >
                  <FaLocationArrow style={{marginRight: '6px'}} /> View Exact Location
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlace && (
        <PlaceDetailsPanel 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
        />
      )}
    </div>
  );
};

export default FavoritesPage;