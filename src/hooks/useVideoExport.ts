import { useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type {
  VideoExportOptions,
  VideoExportProgress,
  VideoExportResult,
  VideoExportStage,
} from '../types/video.types';
import type { AnimationConfig } from '../types/animation.types';
import { exportMapVideo } from '../services/videoExport';

const STAGE_MESSAGES: Record<VideoExportStage, string> = {
  'preparing-map': 'Preparing high-resolution map...',
  recording: 'Recording animation frames...',
  finalizing: 'Finalizing video file...',
};

export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<VideoExportProgress>({
    stage: 'preparing-map',
    percent: 0,
    message: STAGE_MESSAGES['preparing-map'],
  });
  const [error, setError] = useState<string | null>(null);

  const exportVideo = async (
    map: MapLibreMap,
    animationConfig: AnimationConfig,
    durationMs: number,
    options?: Partial<VideoExportOptions>
  ): Promise<VideoExportResult> => {
    setIsExporting(true);
    setProgress({
      stage: 'preparing-map',
      percent: 0,
      message: STAGE_MESSAGES['preparing-map'],
    });
    setError(null);

    try {
      const onProgress = (percent: number) => {
        setProgress((current) => ({
          ...current,
          percent,
        }));
      };

      const onStageChange = (stage: VideoExportStage) => {
        setProgress((current) => ({
          ...current,
          stage,
          message: STAGE_MESSAGES[stage],
        }));
      };

      const { blob, extension } = await exportMapVideo(
        map,
        animationConfig,
        durationMs,
        onProgress,
        onStageChange,
        options
      );

      const createdAtISO = new Date().toISOString();
      const filename = `glighter-${Date.now()}.${extension}`;

      return {
        blob,
        extension,
        filename,
        mimeType: blob.type,
        byteSize: blob.size,
        createdAtISO,
      };
    } catch (err) {
      setError('Failed to export video');
      throw err;
    } finally {
      setIsExporting(false);
      setProgress({
        stage: 'preparing-map',
        percent: 0,
        message: STAGE_MESSAGES['preparing-map'],
      });
    }
  };

  return { exportVideo, isExporting, progress, error };
}
