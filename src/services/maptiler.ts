const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export const getMapStyleUrl = () =>
  `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`;

export const getApiKey = () => API_KEY;
