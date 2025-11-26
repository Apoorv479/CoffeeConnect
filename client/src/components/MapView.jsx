// client/src/components/MapView.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// RED MARKER (User Location)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

MapUpdater.propTypes = { center: PropTypes.object };

const MapView = ({ center, markers, onMarkerClick, searchedLocation }) => {
  const defaultPos = [22.5726, 88.3639]; 
  const displayCenter = center ? [center.lat, center.lng] : defaultPos;

  return (
    <div className="map-wrapper" style={{ height: '100%', width: '100%', zIndex: 0 }}>
       <MapContainer 
         center={displayCenter} 
         zoom={14} 
         style={{ height: '100%', width: '100%' }}
       >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} />

        {/* 1. Searched Location Marker (Red) */}
        {searchedLocation && (
          <Marker position={[searchedLocation.lat, searchedLocation.lng]} icon={redIcon}>
             <Popup>
               <strong>{searchedLocation.name || "You are here"}</strong>
             </Popup>
          </Marker>
        )}

        {/* 2. Cafe Markers (Blue) */}
        {markers && markers.map((place) => (
          <Marker 
            key={place.place_id} 
            position={[place.geometry.location.lat, place.geometry.location.lng]}
            eventHandlers={{
              click: () => {
                if(onMarkerClick) onMarkerClick(place);
              },
            }}
          >
            <Popup><strong>{place.name}</strong></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  center: PropTypes.object,
  markers: PropTypes.array,
  onMarkerClick: PropTypes.func,
  searchedLocation: PropTypes.object,
};

export default MapView;