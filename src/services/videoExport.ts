import type { Map as MapLibreMap } from 'maplibre-gl';

export async function exportMapVideo(
  map: MapLibreMap,
  durationMs: number,
  onProgress: (percent: number) => void
): Promise<Blob> {
  // Get map canvas
  const canvas = map.getCanvas();

  // Set up MediaRecorder
  const stream = canvas.captureStream(30); // 30 FPS
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });

  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // Start recording
  mediaRecorder.start();

  // Simulate progress (based on duration)
  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / durationMs) * 100, 100);
    onProgress(percent);
  }, 100);

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, durationMs));

  // Stop recording
  clearInterval(progressInterval);
  mediaRecorder.stop();

  // Wait for final data
  await new Promise(resolve => {
    mediaRecorder.onstop = resolve;
  });

  // Create video blob
  return new Blob(chunks, { type: 'video/webm' });
}
