// client/src/services/places.service.js

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const initPlacesService = () => {
  return true;
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const searchNearbyCafes = async (location, radius = 5000) => {
  if (!location) {
    console.error("No location provided for search");
    return [];
  }

  console.log("Searching cafes at:", location);

  const query = `
    [out:json][timeout:25];
    (
      nwr["amenity"="cafe"](around:${radius},${location.lat},${location.lng});
      nwr["cuisine"="coffee_shop"](around:${radius},${location.lat},${location.lng});
      nwr["amenity"="restaurant"]["cuisine"="coffee_shop"](around:${radius},${location.lat},${location.lng});
      nwr["amenity"="fast_food"]["cuisine"="coffee"](around:${radius},${location.lat},${location.lng});
    );
    out center;
  `;

  try {
    const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Overpass API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      console.warn("No cafes found in OSM data.");
      return [];
    }

    // Data Mapping + Distance Calculation
    const results = data.elements.map(element => {
      const lat = element.lat || (element.center ? element.center.lat : null);
      const lng = element.lon || (element.center ? element.center.lon : null);

      if (!lat || !lng) return null;

      const dist = getDistanceFromLatLonInKm(location.lat, location.lng, lat, lng);

      return {
        place_id: element.id.toString(),
        name: element.tags.name || "Unnamed Place",
        geometry: {
          location: { lat, lng }
        },
        vicinity: element.tags['addr:street'] || element.tags['addr:city'] || "Address unavailable",
        rating: null,
        tags: element.tags,
        distance: dist
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => a.distance - b.distance);

    return results;

  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const getPlaceDetails = async () => {
  return Promise.resolve(null); 
};