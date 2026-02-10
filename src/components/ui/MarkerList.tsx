import toast from 'react-hot-toast';
import { useMarkerStore } from '../../store/useMarkerStore';
import { cn } from '../../lib/utils';

interface MarkerListProps {
  className?: string;
}

export function MarkerList({ className }: MarkerListProps) {
  const markers = useMarkerStore(state => state.markers);
  const removeMarker = useMarkerStore(state => state.removeMarker);
  const reorderMarkers = useMarkerStore(state => state.reorderMarkers);

  const handleRemove = (id: string, countryName?: string) => {
    removeMarker(id);
    toast.success(`Removed ${countryName || 'location'}`);
  };

  const moveMarker = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    reorderMarkers(index, targetIndex);
  };

  return (
    <div className={cn('p-4', className)}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
        Route Stops
      </h3>
      {markers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white/70 p-4 text-sm text-slate-600">
          Tap the map to add your first location.
        </div>
      )}
      {markers.map((marker, index) => (
        <div
          key={marker.id}
          className="mb-2 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_25px_rgba(11,42,89,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-500/30">
                {marker.order}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-900">
                  {marker.countryName || 'Locating country...'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {marker.position[1].toFixed(4)}, {marker.position[0].toFixed(4)}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRemove(marker.id, marker.countryName)}
              className="rounded-lg p-2 text-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Remove location"
            >
              ×
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <button
              onClick={() => moveMarker(index, -1)}
              disabled={index === 0}
              className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 font-semibold text-slate-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Move location up"
            >
              ↑ Earlier
            </button>
            <button
              onClick={() => moveMarker(index, 1)}
              disabled={index === markers.length - 1}
              className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 font-semibold text-slate-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Move location down"
            >
              ↓ Later
            </button>
            <div className="ml-auto rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
              {marker.order}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
