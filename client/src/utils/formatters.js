// client/src/utils/formatters.js

export const formatDistance = (meters) => {
  if (meters == null) return '';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

export const isOpenNow = (openingHours) => {
  if (!openingHours) return null;
  // The Google Maps Places objects often have an isOpen() method, 
  // but serialized objects might just have open_now boolean.
  return openingHours.open_now ? 'Open Now' : 'Closed';
};