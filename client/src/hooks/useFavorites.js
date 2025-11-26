// client/src/hooks/useFavorites.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cafefinder_favorites';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (place) => {
    let updated;
    const exists = favorites.find((f) => f.place_id === place.place_id);

    if (exists) {
      updated = favorites.filter((f) => f.place_id !== place.place_id);
    } else {
      // Store minimal data
      updated = [...favorites, {
        place_id: place.place_id,
        name: place.name,
        rating: place.rating,
        geometry: place.geometry, // Ensure this is serializable (basic object)
        address: place.vicinity || place.formatted_address
      }];
    }
    
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isFavorite = (placeId) => {
    return !!favorites.find((f) => f.place_id === placeId);
  };

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;