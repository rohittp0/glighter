/**
* Detects the best codec that is both recordable and playable in this browser.
 */
export function getSupportedVideoCodec(): string {
  const video = document.createElement('video');
  const codecs = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
  ];

  for (const codec of codecs) {
    const canRecord = MediaRecorder.isTypeSupported(codec);
    const canPlay = video.canPlayType(codec) !== '';

    if (canRecord && canPlay) {
      return codec;
    }
  }

  throw new Error('No supported video codec found');
}

/**
 * Gets the appropriate file extension for the codec
 */
export function getFileExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('webm')) return 'webm';
  return 'video';
}
