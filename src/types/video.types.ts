export interface VideoExportOptions {
  size: number;               // Square video size (default: 1080)
  fps: number;                // Frame rate (default: 30)
  videoBitsPerSecond: number; // Bitrate in bps (default: 10_000_000 = 10 Mbps)
}

export type VideoExportStage = 'preparing-map' | 'recording' | 'finalizing';

export interface VideoExportProgress {
  stage: VideoExportStage;
  percent: number;
  message: string;
}

export interface VideoExportResult {
  blob: Blob;
  extension: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  createdAtISO: string;
}

export const DEFAULT_EXPORT_OPTIONS: VideoExportOptions = {
  size: 1080,
  fps: 30,
  videoBitsPerSecond: 10_000_000, // 10 Mbps for high quality
};
