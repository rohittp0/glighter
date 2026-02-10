export interface VideoExportOptions {
  size: number;               // Square video size (default: 1080)
  fps: number;                // Frame rate (default: 30)
  videoBitsPerSecond: number; // Bitrate in bps (default: 10_000_000 = 10 Mbps)
}

export const DEFAULT_EXPORT_OPTIONS: VideoExportOptions = {
  size: 1080,
  fps: 30,
  videoBitsPerSecond: 10_000_000, // 10 Mbps for high quality
};
