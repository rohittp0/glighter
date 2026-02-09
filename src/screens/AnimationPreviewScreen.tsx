import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer';
import { MarkerManager } from '../components/map/MarkerManager';
import { CountryLayer } from '../components/map/CountryLayer';
import { AnimationController } from '../components/map/AnimationController';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useMarkerStore } from '../store/useMarkerStore';
import { useAnimationStore } from '../store/useAnimationStore';
import { useVideoExport } from '../hooks/useVideoExport';
import { generateAnimationConfig } from '../utils/animationHelpers';

interface AnimationPreviewScreenProps {
  onBack: () => void;
}

export function AnimationPreviewScreen({ onBack }: AnimationPreviewScreenProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const markers = useMarkerStore(state => state.markers);
  const { isPlaying, setPlaying, setConfig, reset } = useAnimationStore();
  const { exportVideo, isExporting, progress } = useVideoExport();

  useEffect(() => {
    // Generate animation config when screen loads
    const config = generateAnimationConfig(markers);
    setConfig(config);
  }, [markers]);

  const handlePlay = () => {
    reset();
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    reset();
  };

  const handleExport = async () => {
    if (!map) return;

    // Calculate total duration
    const config = generateAnimationConfig(markers);
    const totalDuration = config.waypoints.reduce((sum, w) => sum + w.duration, 0)
      + (markers.length * 1500); // Pause time

    // Start animation and recording
    setPlaying(true);
    try {
      await exportVideo(map, totalDuration);
      toast.success('Video exported successfully!');
    } catch (error) {
      toast.error('Failed to export video');
      console.error('Export error:', error);
    } finally {
      setPlaying(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm z-10 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="m-0 text-xl font-bold text-gray-900">Preview Animation</h1>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer onMapLoad={setMap} />
        <MarkerManager map={map} />
        <CountryLayer map={map} />
        <AnimationController map={map} />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 shadow-lg">
        <div className={`flex gap-2 ${isExporting ? 'mb-4' : ''}`}>
          <Button
            onClick={handlePlay}
            disabled={isPlaying || isExporting}
            variant="primary"
            className="flex-1"
          >
            {isPlaying ? 'Playing...' : 'Play'}
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isPlaying || isExporting}
            variant="secondary"
            className="flex-1"
          >
            Stop
          </Button>
        </div>

        <Button
          onClick={handleExport}
          disabled={isPlaying || isExporting}
          variant="primary"
          className="w-full mt-2"
        >
          {isExporting ? 'Exporting...' : 'Export Video'}
        </Button>

        {isExporting && (
          <ProgressBar progress={progress} label="Exporting video..." />
        )}
      </div>
    </div>
  );
}
