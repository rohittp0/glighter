/**
* Detects the best supported codec for MediaRecorder (prefer MP4)
 */
export function getSupportedVideoCodec(): string {
  const codecs = [
    'video/mp4;codecs=h264',      // Prefer MP4
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
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
