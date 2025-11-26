// client/src/utils/constants.js

export const DEFAULT_ZOOM = 14;

// Default center (Kolkata) if geolocation fails
export const DEFAULT_CENTER = {
  lat: 22.5726,
  lng: 88.3639,
};

export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'];

export const PLACE_FIELDS = [
  'name',
  'rating',
  'user_ratings_total',
  'formatted_address',
  'geometry',
  'photos',
  'opening_hours',
  'place_id',
  'types'
];