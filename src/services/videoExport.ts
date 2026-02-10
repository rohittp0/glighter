import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import type { VideoExportOptions, VideoExportStage } from '../types/video.types';
import type { AnimationConfig } from '../types/animation.types';
import { getSupportedVideoCodec, getFileExtension } from './canvasRecorder';
import { getMapStyleUrl } from './maptiler';
import countriesDataUrl from '../assets/data/countries-50m.geojson?url';

/**
 * Plays animation on a map instance with country highlighting
 */
async function playAnimationOnMap(map: MapLibreMap, config: AnimationConfig): Promise<void> {
  for (let i = 1; i < config.waypoints.length; i++) {
    const waypoint = config.waypoints[i];

    // Update country highlight if waypoint has a country code
    if (waypoint.countryCode && map.getLayer('country-highlight')) {
      map.setPaintProperty('country-highlight', 'fill-opacity', [
        'case',
        ['==', ['get', 'ISO_A2'], waypoint.countryCode],
        config.highlightOpacity,
        0
      ]);
    }

    // Fly to waypoint
    await new Promise<void>((resolve) => {
      const onMoveEnd = () => {
        map.off('moveend', onMoveEnd);
        resolve();
      };
      map.on('moveend', onMoveEnd);

      map.flyTo({
        center: waypoint.center,
        zoom: waypoint.zoom,
        bearing: waypoint.bearing,
        pitch: waypoint.pitch,
        duration: waypoint.duration,
        essential: true,
      });
    });

    // Pause to show location (if it has a country code)
    if (waypoint.countryCode) {
      await new Promise(resolve => setTimeout(resolve, config.pauseAfterWaypointMs));
    }
  }

  // Clear highlight at the end
  if (map.getLayer('country-highlight')) {
    map.setPaintProperty('country-highlight', 'fill-opacity', 0);
  }
}

export async function exportMapVideo(
  sourceMap: MapLibreMap,
  animationConfig: AnimationConfig,
  durationMs: number,
  onProgress: (percent: number) => void,
  onStageChange: (stage: VideoExportStage) => void,
  options: Partial<VideoExportOptions> = {}
): Promise<{ blob: Blob; extension: string }> {
  const fps = options.fps || 30;
  const size = options.size || 1080;

  // Create hidden container for recording map
  const container = document.createElement('div');
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  let recordingMap: MapLibreMap | null = null;
  let stream: MediaStream | null = null;
  let mediaRecorder: MediaRecorder | null = null;

  try {
    onStageChange('preparing-map');
    onProgress(2);

    // Create recording map at square resolution
    recordingMap = new maplibregl.Map({
      container,
      style: getMapStyleUrl(),
      center: sourceMap.getCenter(),
      zoom: sourceMap.getZoom(),
      bearing: sourceMap.getBearing(),
      pitch: sourceMap.getPitch(),
      preserveDrawingBuffer: true,
      interactive: false,
    } as maplibregl.MapOptions);

    // Wait for map to load
    await new Promise<void>((resolve) => {
      recordingMap!.on('load', () => resolve());
    });

    // Add country highlighting layer
    recordingMap.addSource('countries', {
      type: 'geojson',
      data: countriesDataUrl,
    });

    recordingMap.addLayer({
      id: 'country-highlight',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': animationConfig.highlightColor,
        'fill-opacity': 0,
      },
    });

    // Get canvas and set up recording
    const canvas = recordingMap.getCanvas();
    stream = canvas.captureStream(fps);
    const codec = getSupportedVideoCodec();

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: codec,
      videoBitsPerSecond: options.videoBitsPerSecond || 10_000_000,
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onerror = (e) => {
      console.error('MediaRecorder error:', e);
    };

    // Start recording
    onStageChange('recording');
    onProgress(5);
    mediaRecorder.start();

    // Progress tracking
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / durationMs) * 100, 100);
      onProgress(percent);
    }, 100);

    // Play animation on recording map
    await playAnimationOnMap(recordingMap, animationConfig);

    // Stop recording
    clearInterval(progressInterval);
    onStageChange('finalizing');
    onProgress(95);
    mediaRecorder.stop();

    // Wait for final data
    await new Promise<void>((resolve) => {
      mediaRecorder!.onstop = () => resolve();
    });

    const recorderMimeType = mediaRecorder.mimeType || codec;
    const normalizedMimeType = recorderMimeType.split(';')[0];

    // Create video blob
    const blob = new Blob(chunks, { type: normalizedMimeType });
    const extension = getFileExtension(recorderMimeType);

    if (blob.size === 0) {
      throw new Error('Video export produced an empty file.');
    }

    onProgress(100);

    return { blob, extension };
  } finally {
    // Cleanup
    if (recordingMap) {
      recordingMap.remove();
    }
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}
