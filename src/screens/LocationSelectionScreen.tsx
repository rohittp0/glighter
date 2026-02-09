import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer';
import { MarkerManager } from '../components/map/MarkerManager';
import { MarkerList } from '../components/ui/MarkerList';
import { Button } from '../components/ui/Button';
import { useMarkerStore } from '../store/useMarkerStore';
import { useCountryGeocoding } from '../hooks/useCountryGeocoding';

interface LocationSelectionScreenProps {
  onNext: () => void;
}

export function LocationSelectionScreen({ onNext }: LocationSelectionScreenProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markers = useMarkerStore(state => state.markers);
  const addMarker = useMarkerStore(state => state.addMarker);

  useCountryGeocoding();

  const handleMapLoad = (mapInstance: MapLibreMap) => {
    setMap(mapInstance);
    setIsLoading(false);
  };

  const handleMapClick = (lng: number, lat: number) => {
    addMarker([lng, lat]);
    toast.success('Location added');
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm z-10">
        <h1 className="m-0 text-xl font-bold text-gray-900">Add Locations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tap the map to add countries
        </p>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <MapContainer onMapLoad={handleMapLoad} onClick={handleMapClick} />
        <MarkerManager map={map} />
      </div>

      {/* Bottom panel */}
      <div className="bg-surface max-h-[40vh] overflow-auto rounded-t-2xl shadow-lg">
        <MarkerList />
        <div className="p-4">
          <Button
            onClick={onNext}
            disabled={markers.length < 2}
            className="w-full"
          >
            Next: Preview Animation
          </Button>
          {markers.length < 2 && (
            <p className="mt-2 text-xs text-gray-600 text-center">
              Add at least 2 locations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
