// client/src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import MapView from '../components/MapView';
import CafeList from '../components/CafeList';
import PlaceDetailsPanel from '../components/PlaceDetailsPanel';
import useGeolocation from '../hooks/useGeolocation';
import usePlacesSearch from '../hooks/usePlacesSearch';
import { DEFAULT_CENTER } from '../utils/constants';
import { useSearch } from '../context/SearchContext';
import { useSettings } from '../context/SettingsContext';

const HomePage = () => {
  const { location, loading: geoLoading } = useGeolocation();
  const { places, searchPlaces, loading: searchLoading } = usePlacesSearch();
  const { searchedLocation, setSearchedLocation } = useSearch(); 
  const { radius } = useSettings();
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  
  const initialSetDone = useRef(false);

  // 1. Initial Load (Using Settings Radius)
  useEffect(() => {
    if (location && !geoLoading && !searchedLocation && !initialSetDone.current) {
      initialSetDone.current = true; 
      const userLocation = {
        lat: location.lat, lng: location.lng, name: "You are here"
      };
      setSearchedLocation(userLocation);
      setCenter(userLocation);
      // Pass radius here
      searchPlaces(userLocation, radius);
    }
  }, [location, geoLoading, searchedLocation, setSearchedLocation, searchPlaces, radius]);

  // 2. Listen for Search/Radius Updates
  useEffect(() => {
    if (searchedLocation) {
      setCenter(searchedLocation);
      // Pass radius here too
      searchPlaces(searchedLocation, radius);
      setSelectedPlace(null);
    }
  }, [searchedLocation, searchPlaces, radius]);

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    const el = document.getElementById(`card-${place.place_id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleListSelect = (place) => {
    setSelectedPlace(place);
    setCenter(place.geometry.location); 
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div style={{padding: '1.5rem', borderBottom: '1px solid #EAECEF'}}>
          <h3 style={{fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#2C3E50'}}>
            {searchedLocation ? (searchedLocation.name === "You are here" ? " Cafes Near You" : searchedLocation.name.split(',')[0]) : "Nearby Cafes"}
          </h3>
          <p style={{fontSize: '0.85rem', color: '#7F8C8D', marginTop: '5px'}}>
             {searchLoading ? `Scanning ${radius/1000}km radius...` : `Found ${places.length} places within ${radius/1000}km`}
          </p>
        </div>

        {searchLoading ? (
           <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Scanning area...</div>
        ) : (
          <CafeList 
            places={places} 
            selectedPlaceId={selectedPlace?.place_id} 
            onSelect={handleListSelect} 
          />
        )}
      </div>
      
      <div className="map-wrapper">
        <MapView 
          center={center} 
          markers={places} 
          onMarkerClick={handleMarkerClick}
          searchedLocation={searchedLocation} 
        />
      </div>

      {selectedPlace && (
        <PlaceDetailsPanel 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;