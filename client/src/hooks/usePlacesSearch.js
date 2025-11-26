// client/src/hooks/usePlacesSearch.js
import { useState, useCallback } from 'react';
import { searchNearbyCafes } from '../services/places.service';

const usePlacesSearch = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Updated: Added 'radius' parameter
  const searchPlaces = useCallback(async (location, radius = 3000) => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchNearbyCafes(location, radius);
      setPlaces(results);
    } catch (err) {
      console.error("Search failed", err);
      setError("Failed to fetch places.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { places, loading, error, searchPlaces };
};

export default usePlacesSearch;