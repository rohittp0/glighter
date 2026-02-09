import { useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { exportMapVideo } from '../services/videoExport';

export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const exportVideo = async (map: MapLibreMap, durationMs: number) => {
    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      const blob = await exportMapVideo(map, durationMs, setProgress);

      // Download video
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glighter-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      return blob;
    } catch (err) {
      setError('Failed to export video');
      throw err;
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return { exportVideo, isExporting, progress, error };
}
