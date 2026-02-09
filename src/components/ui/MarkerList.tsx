import toast from 'react-hot-toast';
import { useMarkerStore } from '../../store/useMarkerStore';

export function MarkerList() {
  const markers = useMarkerStore(state => state.markers);
  const removeMarker = useMarkerStore(state => state.removeMarker);

  const handleRemove = (id: string, countryName?: string) => {
    removeMarker(id);
    toast.success(`Removed ${countryName || 'location'}`);
  };

  return (
    <div className="p-4">
      <h3 className="mb-3 text-gray-900 font-semibold">Locations</h3>
      {markers.length === 0 && (
        <p className="text-gray-600 text-sm">Tap the map to add locations</p>
      )}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {marker.order}
            </div>
            <div>
              <div className="font-semibold">
                {marker.countryName || 'Locating...'}
              </div>
              <div className="text-xs text-gray-600">
                {marker.position[1].toFixed(4)}, {marker.position[0].toFixed(4)}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleRemove(marker.id, marker.countryName)}
            className="text-primary text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Remove location"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
