// client/src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCoffee, FaSearch, FaMapMarkerAlt, FaTimes, FaLocationArrow, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext'; // AuthContext import

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearchedLocation } = useSearch();
  const { user, logout } = useAuth();
  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const debounceTimeout = useRef(null);
  const isActive = (path) => location.pathname === path ? '#D35400' : '#2C3E50';

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (value.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceTimeout.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const fetchSuggestions = async (searchText) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&addressdetails=1&limit=5&countrycodes=in`);
      const data = await response.json();
      setSuggestions(data); setShowSuggestions(true);
    } catch (err) { console.error(err); }
  };

  const handleSuggestionClick = (place) => {
    setQuery(place.display_name); setSuggestions([]); setShowSuggestions(false);
    setSearchedLocation({ lat: parseFloat(place.lat), lng: parseFloat(place.lon), name: place.display_name });
    navigate('/');
  };

  const clearSearch = () => { setQuery(""); setSuggestions([]); setShowSuggestions(false); };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchedLocation({ lat: position.coords.latitude, lng: position.coords.longitude, name: "My Current Location" });
        setQuery("My Current Location"); setLoadingLoc(false); navigate('/');
      },
      (error) => { console.error(error); alert("Location error"); setLoadingLoc(false); }
    );
  };

  const handleManualSearch = async (e) => {
    e.preventDefault(); if (!query.trim()) return; setShowSuggestions(false);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`);
      const data = await response.json();
      if (data && data.length > 0) handleSuggestionClick(data[0]); else alert("Location not found!");
    } catch (err) { console.error(err); }
  };

  // Logic to handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="app-header" onClick={(e) => e.stopPropagation()}>
      
      {/* 1. LOGO SECTION (Always Visible) */}
      <div className="logo" style={{flex: user ? 0.5 : 1}}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <FaCoffee color="#e67e22"/> CafeFinder
        </Link>
      </div>

      {/* SEARCH BAR & NAV - Only Visible if User is Logged In */}
      {user && (
        <>
          {/* 2. SEARCH BAR SECTION */}
          <div style={{ flex: 2, maxWidth: '600px', display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <form onSubmit={handleManualSearch}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input type="text" placeholder="Search location..." value={query} onChange={handleInputChange} onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }} style={{ width: '100%', padding: '10px 40px 10px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '1rem' }} />
                  {query.length > 0 ? (
                    <button type="button" onClick={clearSearch} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1rem' }} title="Clear search"><FaTimes /></button>
                  ) : (
                    <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><FaSearch /></button>
                  )}
                </div>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((place) => (
                    <li key={place.place_id} onClick={() => handleSuggestionClick(place)} className="suggestion-item"><FaMapMarkerAlt style={{ color: '#e67e22', marginTop: '3px', flexShrink: 0 }} /> <span>{place.display_name}</span></li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={handleCurrentLocation} title="Use My Current Location" style={{ background: '#e67e22', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', flexShrink: 0 }}>
              {loadingLoc ? <span style={{ fontSize: '10px' }}>...</span> : <FaLocationArrow />}
            </button>
          </div>

          {/* 3. NAVIGATION LINKS (Shifted Left & Logout Added) */}
          <nav className="nav-links" style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px'}}>
            <Link to="/" style={{color: isActive('/'), fontWeight: '600', textDecoration: 'none'}}>Home</Link>
            <Link to="/favorites" style={{color: isActive('/favorites'), fontWeight: '600', textDecoration: 'none'}}>Favorites</Link>
            <Link to="/about" style={{color: isActive('/about'), fontWeight: '600', textDecoration: 'none'}}>About</Link>
            
            {/* Divider */}
            <div style={{height: '20px', width: '1px', backgroundColor: '#ddd'}}></div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              title="Logout"
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#e74c3c', 
                fontSize: '1rem', 
                fontWeight: '600',
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px'
              }}
            >
              Logout <FaSignOutAlt />
            </button>

            {/* Settings Icon */}
            <Link to="/settings" title="Settings">
              <FaCog size={22} color={isActive('/settings')}/>
            </Link>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;