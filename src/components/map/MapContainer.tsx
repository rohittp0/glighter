import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getMapStyleUrl } from '../../services/maptiler';

interface MapContainerProps {
  onMapLoad?: (map: MapLibreMap) => void;
  onClick?: (lng: number, lat: number) => void;
}

export function MapContainer({ onMapLoad, onClick }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapStyleUrl(),
      center: [0, 20],
      zoom: 2,
    });

    map.on('load', () => {
      onMapLoad?.(map);
    });

    if (onClick) {
      map.on('click', (e) => {
        onClick(e.lngLat.lng, e.lngLat.lat);
      });
    }

    mapRef.current = map;

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
}
