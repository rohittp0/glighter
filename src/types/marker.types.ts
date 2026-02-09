export interface Marker {
  id: string;
  position: [number, number]; // [lng, lat]
  order: number;
  countryCode?: string;
  countryName?: string;
}
