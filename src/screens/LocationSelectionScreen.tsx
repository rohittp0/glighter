import { useState } from 'react';
import type { MouseEvent } from 'react';
import toast from 'react-hot-toast';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer';
import { MarkerManager } from '../components/map/MarkerManager';
import { MarkerList } from '../components/ui/MarkerList';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { useMarkerStore } from '../store/useMarkerStore';
import { useCountryGeocoding } from '../hooks/useCountryGeocoding';
import { cn } from '../lib/utils';

interface LocationSelectionScreenProps {
  onNext: () => void;
}

const FLOW_STEPS = ['Locations', 'Templates', 'Preview', 'Result'];
const MOBILE_SHEET_HEIGHTS = {
  compact: 'h-[230px]',
  medium: 'h-[44vh]',
  full: 'h-[74vh]',
} as const;

type SheetState = keyof typeof MOBILE_SHEET_HEIGHTS;

export function LocationSelectionScreen({ onNext }: LocationSelectionScreenProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetState, setSheetState] = useState<SheetState>('medium');
  const [isSheetMinimized, setIsSheetMinimized] = useState(false);
  const markers = useMarkerStore(state => state.markers);
  const addMarker = useMarkerStore(state => state.addMarker);
  const clearMarkers = useMarkerStore(state => state.clearMarkers);

  useCountryGeocoding();

  const handleMapLoad = (mapInstance: MapLibreMap) => {
    setMap(mapInstance);
    setIsLoading(false);
  };

  const handleMapClick = (lng: number, lat: number) => {
    addMarker([lng, lat]);
    toast.success('Location added');
  };

  const handleMapInteraction = () => {
    setIsSheetMinimized(true);
  };

  const handleClear = () => {
    clearMarkers();
    toast.success('Locations cleared');
  };

  const handleContinueToTemplates = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onNext();
  };

  const cycleSheetSize = () => {
    if (isSheetMinimized) {
      setIsSheetMinimized(false);
      setSheetState('medium');
      return;
    }

    setSheetState((current) => {
      if (current === 'compact') return 'medium';
      if (current === 'medium') return 'full';
      return 'compact';
    });
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#dbeeff_0%,#ecf5ff_32%,#f5f9ff_100%)]">
      <div className="h-full md:grid md:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative h-full overflow-hidden md:min-h-0">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/85 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600">Loading map canvas...</p>
              </div>
            </div>
          )}

          <MapContainer
            onMapLoad={handleMapLoad}
            onClick={handleMapClick}
            onInteraction={handleMapInteraction}
          />
          <MarkerManager map={map} />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,43,0.58)_0%,rgba(3,18,43,0.06)_32%,rgba(3,18,43,0)_100%)]" />

          <div className="absolute left-0 right-0 top-0 z-30 hidden p-4 sm:p-5 md:block">
            <div className="rounded-2xl border border-white/30 bg-white/20 p-3 text-white shadow-[0_14px_35px_rgba(5,26,60,0.35)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Glighter Studio</p>
              <h1 className="text-2xl font-bold tracking-tight">Build your route</h1>
              <p className="text-xs text-blue-100 sm:text-sm">Tap the map to add destinations, then tune order in the route sheet.</p>
              <StepIndicator currentStep={1} labels={FLOW_STEPS} className="mt-3" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20 hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              {markers.length} location{markers.length === 1 ? '' : 's'} selected
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl border border-white/60 bg-white/85 shadow-[0_-16px_40px_rgba(9,36,77,0.2)] backdrop-blur-xl transition-[height] duration-300 md:static md:h-full md:rounded-none md:border-l md:border-white/50 md:bg-white/80',
            isSheetMinimized ? 'h-[108px]' : MOBILE_SHEET_HEIGHTS[sheetState],
            'md:h-full'
          )}
        >
          <div className="px-4 pb-2 pt-2 md:hidden">
            <button
              onClick={cycleSheetSize}
              className="mx-auto block h-1.5 w-14 rounded-full bg-blue-300"
              aria-label={isSheetMinimized ? 'Expand route editor' : 'Resize route editor'}
            />
          </div>

          <div className={cn('border-b border-blue-100/80 px-4 pb-3 pt-2', isSheetMinimized && 'hidden md:block')}>
            <button
              onClick={cycleSheetSize}
              className="mx-auto mb-2 hidden h-1.5 w-14 rounded-full bg-blue-200 md:block"
              aria-label="Resize location sheet"
            />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Route editor</h2>
                <p className="text-xs text-slate-600">Reorder stops to shape the animation path.</p>
              </div>
              <Button
                onClick={handleClear}
                variant="ghost"
                size="sm"
                disabled={markers.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className={cn('min-h-0 flex-1 overflow-y-auto', isSheetMinimized && 'hidden md:block')}>
            <MarkerList />
          </div>

          <div className="border-t border-blue-100/80 bg-white/90 p-4">
            <Button
              onClick={handleContinueToTemplates}
              disabled={markers.length < 2}
              size="lg"
              className="w-full"
            >
              Continue to Templates
            </Button>
            {markers.length < 2 && !isSheetMinimized && (
              <p className="mt-2 text-center text-xs text-slate-600">
                Add at least two locations to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
