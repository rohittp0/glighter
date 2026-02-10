import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { PanelCard } from '../components/ui/PanelCard';
import type { VideoExportResult } from '../types/video.types';

interface VideoPreviewScreenProps {
  video: VideoExportResult;
  onBack: () => void;
}

const FLOW_STEPS = ['Locations', 'Templates', 'Preview', 'Result'];

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VideoPreviewScreen({ video, onBack }: VideoPreviewScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const objectUrl = URL.createObjectURL(video.blob);
    videoElement.src = objectUrl;
    videoElement.load();

    const autoplayPromise = videoElement.play();
    autoplayPromise?.catch(() => {
      // Controls remain visible, user can manually play.
    });

    return () => {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
      URL.revokeObjectURL(objectUrl);
    };
  }, [video.blob]);

  const handleDownload = () => {
    const url = URL.createObjectURL(video.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = video.filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Video downloaded!');
  };

  const handleShare = async () => {
    const file = new File(
      [video.blob],
      video.filename,
      { type: video.mimeType }
    );

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Glighter Animation',
          text: 'I created this map animation in Glighter.',
          files: [file],
        });
        toast.success('Video shared!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
          toast.error('Failed to share video');
        }
      }
    } else {
      toast('Sharing is not supported here. Downloading instead.');
      handleDownload();
    }
  };

  const createdAtLabel = new Date(video.createdAtISO).toLocaleString();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#dbeeff_0%,#edf6ff_35%,#f8fbff_100%)] p-4 sm:p-5">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4">
        <PanelCard className="hidden p-4 md:block">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Export complete</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your video is ready</h1>
              <p className="mt-1 text-sm text-slate-600">Review, download, or share your rendered map animation.</p>
            </div>
            <Button onClick={onBack} variant="ghost" size="sm">
              ← Back to preview
            </Button>
          </div>
          <StepIndicator currentStep={4} labels={FLOW_STEPS} className="mt-3" />
        </PanelCard>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <PanelCard className="min-h-0 p-4 sm:p-5">
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">Playback</h2>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  Ready
                </span>
              </div>
              <div className="relative aspect-square w-full max-h-[62vh] overflow-hidden rounded-2xl bg-slate-950">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </PanelCard>

          <PanelCard className="flex flex-col gap-4 p-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">Details</h2>
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>Format</span>
                  <span className="font-semibold uppercase">{video.extension}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>Approx size</span>
                  <span className="font-semibold">{formatFileSize(video.byteSize)}</span>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-semibold">{createdAtLabel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleDownload} size="lg" className="w-full">
                Download video
              </Button>
              <Button onClick={handleShare} variant="secondary" size="lg" className="w-full">
                Share
              </Button>
              <Button onClick={onBack} variant="ghost" size="md" className="w-full">
                Back to Preview
              </Button>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
