// client/src/services/mapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_LIBRARIES } from '../utils/constants';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let loaderInstance = null;

export const loadGoogleMaps = () => {
  if (!apiKey) {
    console.error("Google Maps API Key is missing in .env");
    return Promise.reject("API Key missing");
  }

  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: GOOGLE_MAPS_LIBRARIES,
    });
  }

  return loaderInstance.load();
};