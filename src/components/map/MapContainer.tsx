import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getMapStyleUrl } from '../../services/maptiler';
import { cn } from '../../lib/utils';

interface MapContainerProps {
  onMapLoad?: (map: MapLibreMap) => void;
  onClick?: (lng: number, lat: number) => void;
  onInteraction?: () => void;
  className?: string;
}

export function MapContainer({ onMapLoad, onClick, onInteraction, className }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const onMapLoadRef = useRef(onMapLoad);
  const onClickRef = useRef(onClick);
  const onInteractionRef = useRef(onInteraction);

  useEffect(() => {
    onMapLoadRef.current = onMapLoad;
  }, [onMapLoad]);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    onInteractionRef.current = onInteraction;
  }, [onInteraction]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapStyleUrl(),
      center: [0, 20],
      zoom: 2,
      preserveDrawingBuffer: true,
    } as maplibregl.MapOptions);

    map.on('load', () => {
      onMapLoadRef.current?.(map);
    });

    const notifyInteraction = () => {
      onInteractionRef.current?.();
    };

    const interactionEvents: Array<'dragstart' | 'touchstart' | 'mousedown' | 'zoomstart' | 'rotatestart' | 'pitchstart'> = [
      'dragstart',
      'touchstart',
      'mousedown',
      'zoomstart',
      'rotatestart',
      'pitchstart',
    ];

    interactionEvents.forEach((eventName) => {
      map.on(eventName, notifyInteraction);
    });

    map.on('click', (e) => {
      onClickRef.current?.(e.lngLat.lng, e.lngLat.lat);
      onInteractionRef.current?.();
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        map.off(eventName, notifyInteraction);
      });
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className={cn('absolute inset-0', className)}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
