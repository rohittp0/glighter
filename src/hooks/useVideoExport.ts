import {useState} from 'react';
import type {Map as MapLibreMap} from 'maplibre-gl';
import type {VideoExportOptions} from '../types/video.types';
import type {AnimationConfig} from '../types/animation.types';
import {exportMapVideo} from '../services/videoExport';

export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const exportVideo = async (
    map: MapLibreMap,
    animationConfig: AnimationConfig,
    durationMs: number,
    options?: Partial<VideoExportOptions>
  ): Promise<{ blob: Blob; extension: string }> => {
    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
        // Don't auto-download - just return the result
      return await exportMapVideo(
          map,
          animationConfig,
          durationMs,
          setProgress,
          options
      );
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
