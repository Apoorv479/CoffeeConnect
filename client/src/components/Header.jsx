// client/src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCoffee, FaSearch, FaMapMarkerAlt, FaTimes, FaLocationArrow } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import { FaCog } from 'react-icons/fa'; // Import



const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearchedLocation } = useSearch();
  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false); // Location loading state

  const debounceTimeout = useRef(null);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // 1. Input Change Handler with Debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // 2. Fetch Suggestions (Optimized for India)
  const fetchSuggestions = async (searchText) => {
    try {
      
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&addressdetails=1&limit=5&countrycodes=in`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    }
  };

  const handleSuggestionClick = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    const newLocation = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name
    };
    setSearchedLocation(newLocation);
    navigate('/');
  };

  // 3. Clear Text Function (Cut Icon Logic)
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 4. Current Location Button Logic
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLoc(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const myLocation = {
          lat: latitude,
          lng: longitude,
          name: "My Current Location"
        };
        
        setSearchedLocation(myLocation);
        setQuery("My Current Location");
        setLoadingLoc(false);
        navigate('/');
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location.");
        setLoadingLoc(false);
      }
    );
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`);
      const data = await response.json();

      if (data && data.length > 0) {
        handleSuggestionClick(data[0]);
      } else {
        alert("Location not found!");
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="app-header" onClick={(e) => e.stopPropagation()}>
      <div className="logo" style={{flex: 1}}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <FaCoffee color="#e67e22"/> CafeFinder
        </Link>
      </div>

      {/* Middle Section: Search Bar + Location Button */}
      <div style={{ flex: 2, maxWidth: '600px', display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1 }}>
          <form onSubmit={handleManualSearch}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Search location in India..."
                value={query}
                onChange={handleInputChange}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 15px',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
              
              {query.length > 0 ? (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1rem'
                  }}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              ) : (
                <button 
                  type="submit" 
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#666'
                  }}
                >
                  <FaSearch />
                </button>
              )}
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((place) => (
                <li 
                  key={place.place_id} 
                  onClick={() => handleSuggestionClick(place)}
                  className="suggestion-item"
                >
                  <FaMapMarkerAlt style={{ color: '#e67e22', marginTop: '3px', flexShrink: 0 }} />
                  <span>{place.display_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Location Button (GPS) */}
        <button 
          onClick={handleCurrentLocation}
          title="Use My Current Location"
          style={{
            background: '#e67e22',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            flexShrink: 0
          }}
        >
          {loadingLoc ? (
            <span style={{ fontSize: '10px' }}>...</span> // Simple loading
          ) : (
            <FaLocationArrow />
          )}
        </button>

      </div>

      <nav className="nav-links" style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/favorites" className={isActive('/favorites')}>Favorites</Link>
        <Link to="/about" className={isActive('/about')}>About</Link>
        <Link to="/settings" title="Settings"><FaCog size={20} color={isActive('/settings')}/></Link>
      </nav>
    </header>
  );
};

export default Header;