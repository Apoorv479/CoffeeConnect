// client/src/components/PlaceDetailsPanel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFavorites from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext'; // Auth Import kiya
// Icons imports
import { FaHeart, FaRegHeart, FaTimes, FaUtensils, FaGlobe, FaClock, FaWheelchair, FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';

const PlaceDetailsPanel = ({ place, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth(); // Logged in user check karne ke liye

  // --- Existing States ---
  const [fetchedAddress, setFetchedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // --- New Review States ---
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // Star hover effect ke liye
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // 1. Fetch Address & Reviews on Mount
  useEffect(() => {
    if (place) {
        // A. Address Fetch Logic (Existing)
        setFetchedAddress(null);
        if (!place.vicinity || place.vicinity === "Address unavailable") {
            setLoadingAddress(true);
            const { lat, lng } = place.geometry.location;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => setFetchedAddress(data.display_name))
                .catch(err => console.error("Address fetch failed", err))
                .finally(() => setLoadingAddress(false));
        }

        // B. Fetch Reviews Logic (NEW)
        fetchReviews();
    }
  }, [place]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
        const res = await fetch(`http://localhost:5000/api/reviews/${place.place_id}`);
        const data = await res.json();
        setReviews(data);
    } catch (err) {
        console.error("Failed to fetch reviews", err);
    } finally {
        setLoadingReviews(false);
    }
  };

  const handleFavorite = () => {
    toggleFavorite(place);
  };

  // --- Submit Review Function (NEW) ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a star rating");
    
    setSubmitting(true);
    try {
        const token = localStorage.getItem('cafefinder_token');
        const res = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                rating,
                comment,
                cafeId: place.place_id,
                cafeName: place.name
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to post review');

        // Success: Reset form and refresh list
        setComment("");
        setRating(0);
        fetchReviews(); // List refresh
        alert("Review submitted successfully!");

    } catch (err) {
        alert(err.message);
    } finally {
        setSubmitting(false);
    }
  };

  if (!place) return null;

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
        
        {/* --- HEADER SECTION (Unchanged) --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem' }}>
          <h2 style={{maxWidth: '85%', fontSize: '1.5rem', color: '#2C3E50'}}>{place.name}</h2>
          <button onClick={handleFavorite} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#e74c3c' }}>
            {isFavorite(place.place_id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        
        <div style={{ margin: '1rem 0', color: '#555', fontSize: '0.95rem' }}>
            <p style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <FaMapMarkerAlt style={{ marginTop: '3px', color: '#e67e22' }} /> 
                <span>{loadingAddress ? "Fetching exact address..." : displayAddress}</span>
            </p>

            {tags.cuisine && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <FaUtensils style={{ color: '#e67e22' }} /> {formatText(tags.cuisine)}
                </p>
            )}
        </div>

        {/* --- INFO BOX (Unchanged) --- */}
        {(tags.opening_hours || tags.website || tags.wheelchair) && (
            <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tags.opening_hours && <p style={{ display: 'flex', gap: '8px' }}><FaClock /> <strong>Hours:</strong> {tags.opening_hours}</p>}
                {tags.website && <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><FaGlobe /> <a href={tags.website} target="_blank" rel="noreferrer" style={{color: '#3498db'}}>Visit Website</a></p>}
                {tags.wheelchair && <p style={{ display: 'flex', gap: '8px' }}><FaWheelchair /> <strong>Wheelchair Access:</strong> {formatText(tags.wheelchair)}</p>}
            </div>
        )}

        {(!tags.opening_hours && !tags.website && !tags.wheelchair) && (
            <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '1rem' }}>Additional details not available on OpenStreetMap.</p>
        )}

        <div style={{ marginTop: '1.5rem' }}>
            <a 
                href={`http://googleusercontent.com/maps.google.com/?q=${place.geometry.location.lat},${place.geometry.location.lng}`} 
                target="_blank" rel="noreferrer" className="btn"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#D35400', color: 'white', padding: '10px', borderRadius: '8px' }}
            >
                Open in Google Maps
            </a>
        </div>

        {/* ============================================================ */}
        {/* NEW REVIEWS SECTION                         */}
        {/* ============================================================ */}
        
        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #EAECEF' }} />
        
        <h3 style={{fontSize: '1.2rem', marginBottom: '1rem', color: '#2C3E50'}}>Reviews & Ratings</h3>

        {/* 1. ADD REVIEW FORM */}
        {user ? (
            <div style={{ background: '#FFF8F3', padding: '1.2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #ffdec0' }}>
                <p style={{fontWeight: '600', marginBottom: '0.5rem', color: '#D35400'}}>Rate this place</p>
                
                {/* Star Input */}
                <div style={{display: 'flex', gap: '5px', marginBottom: '1rem'}}>
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input 
                                    type="radio" name="rating" value={ratingValue} 
                                    onClick={() => setRating(ratingValue)}
                                    style={{display: 'none'}}
                                />
                                <FaStar 
                                    size={25} 
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                    style={{cursor: 'pointer', transition: 'color 0.2s'}}
                                />
                            </label>
                        );
                    })}
                </div>

                <textarea 
                    placeholder="Share your experience (e.g. Best coffee ever!)..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', outline: 'none', fontSize: '0.9rem'}}
                />

                <button 
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    style={{
                        marginTop: '10px', padding: '8px 16px', background: '#2C3E50', color: 'white', 
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
                    }}
                >
                    {submitting ? 'Posting...' : 'Submit Review'}
                </button>
            </div>
        ) : (
            <div style={{textAlign: 'center', padding: '1rem', background: '#F4F6F8', borderRadius: '8px', marginBottom: '2rem'}}>
                <p style={{color: '#666'}}>Please <strong style={{color: '#D35400'}}>Login</strong> to write a review.</p>
            </div>
        )}

        {/* 2. REVIEWS LIST */}
        <div className="reviews-list">
            {loadingReviews ? (
                <p style={{color: '#999', fontStyle: 'italic'}}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p style={{color: '#999', fontStyle: 'italic'}}>No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map((rev) => (
                    <div key={rev._id} style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                            <strong style={{color: '#2C3E50'}}>{rev.user?.name || "Anonymous"}</strong>
                            <span style={{fontSize: '0.8rem', color: '#999'}}>
                                {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{display: 'flex', gap: '2px', marginBottom: '6px'}}>
                            {[...Array(5)].map((star, i) => (
                                <FaStar key={i} size={14} color={i < rev.rating ? "#ffc107" : "#e4e5e9"} />
                            ))}
                        </div>
                        <p style={{color: '#555', fontSize: '0.95rem', lineHeight: '1.4'}}>{rev.comment}</p>
                    </div>
                ))
            )}
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