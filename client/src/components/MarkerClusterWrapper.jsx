// client/src/components/MarkerClustererWrapper.jsx
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MarkerClustererWrapper = ({ map, google, places, onMarkerClick }) => {
  const clustererRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    markersRef.current = places.map((place) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        title: place.name,
      });

      marker.addListener("click", () => {
        if (onMarkerClick) onMarkerClick(place);
      });

      return marker;
    });

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({ map, markers: markersRef.current });
    } else {
      clustererRef.current.addMarkers(markersRef.current);
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
    };
  }, [places, map, google, onMarkerClick]);

  return null;
};

MarkerClustererWrapper.propTypes = {
  map: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  onMarkerClick: PropTypes.func,
};

export default MarkerClustererWrapper;