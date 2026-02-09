export interface CountryProperties {
  NAME: string;
  ISO_A2: string;
  ISO_A3: string;
}

export interface CountryFeature {
  type: 'Feature';
  properties: CountryProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface CountryCollection {
  type: 'FeatureCollection';
  features: CountryFeature[];
}
