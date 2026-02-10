import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer';
import { MarkerManager } from '../components/map/MarkerManager';
import { CountryLayer } from '../components/map/CountryLayer';
import { AnimationController } from '../components/map/AnimationController';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StepIndicator } from '../components/ui/StepIndicator';
import { PanelCard } from '../components/ui/PanelCard';
import { useMarkerStore } from '../store/useMarkerStore';
import { useAnimationStore } from '../store/useAnimationStore';
import { useVideoExport } from '../hooks/useVideoExport';
import { generateAnimationConfig } from '../utils/animationHelpers';
import { getTemplateById } from '../constants/templates';
import type { VideoExportResult } from '../types/video.types';

interface AnimationPreviewScreenProps {
  onBack: () => void;
  onExportComplete: (result: VideoExportResult) => void;
}

const FLOW_STEPS = ['Locations', 'Templates', 'Preview', 'Result'];

export function AnimationPreviewScreen({ onBack, onExportComplete }: AnimationPreviewScreenProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const markers = useMarkerStore(state => state.markers);
  const { isPlaying, setPlaying, setConfig, reset, selectedTemplateId } = useAnimationStore();
  const { exportVideo, isExporting, progress } = useVideoExport();
  const selectedTemplate = getTemplateById(selectedTemplateId);

  useEffect(() => {
    const config = generateAnimationConfig(markers, selectedTemplateId);
    setConfig(config);
  }, [markers, selectedTemplateId, setConfig]);

  const handlePlay = () => {
    reset();
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    reset();
  };

  const handleExport = async () => {
    if (!map) return;

    const config = generateAnimationConfig(markers, selectedTemplateId);

    const pauseCount = config.waypoints.filter((waypoint) => waypoint.countryCode).length;
    const totalDuration = config.waypoints.reduce((sum, w) => sum + w.duration, 0)
      + (pauseCount * config.pauseAfterWaypointMs);

    setPlaying(true);

    try {
      const result = await exportVideo(map, config, totalDuration);
      onExportComplete(result);
    } catch (error) {
      toast.error('Failed to export video');
      console.error('Export error:', error);
    } finally {
      setPlaying(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#dbeeff_0%,#edf6ff_38%,#f6faff_100%)]">
      <div className="relative h-full">
        <MapContainer onMapLoad={setMap} />
        <MarkerManager map={map} />
        <CountryLayer map={map} />
        <AnimationController map={map} />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,22,56,0.62)_0%,rgba(4,22,56,0.06)_30%,rgba(4,22,56,0.18)_72%,rgba(4,22,56,0.7)_100%)]" />

        <div className="absolute left-0 right-0 top-0 z-20 hidden p-4 sm:p-5 md:block">
          <div className="rounded-2xl border border-white/35 bg-white/16 p-3 text-white shadow-[0_14px_35px_rgba(5,26,60,0.35)] backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Step 3</p>
                <h1 className="text-2xl font-bold tracking-tight">Preview & export</h1>
              </div>
              <Button onClick={onBack} variant="secondary" size="sm">
                ← Back to templates
              </Button>
            </div>
            <p className="mt-1 text-xs text-blue-100 sm:text-sm">
              Template: {selectedTemplate.name}. Preview the route before exporting.
            </p>
            <StepIndicator currentStep={3} labels={FLOW_STEPS} className="mt-3" />
          </div>
        </div>

        <div className="absolute left-3 top-3 z-20 flex items-center gap-2 md:hidden">
          <Button onClick={onBack} variant="secondary" size="sm">
            ← Back
          </Button>
          <span className="rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm">
            {selectedTemplate.name}
          </span>
        </div>

        <div className="absolute bottom-5 left-4 right-4 z-20 md:left-auto md:w-[380px]">
          <PanelCard className="p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
              Playback controls
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handlePlay}
                disabled={isPlaying || isExporting}
                variant="secondary"
              >
                {isPlaying ? 'Playing...' : 'Play'}
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isPlaying || isExporting}
                variant="ghost"
              >
                Stop
              </Button>
            </div>
            <Button
              onClick={handleExport}
              disabled={isPlaying || isExporting}
              size="lg"
              className="mt-3 w-full"
            >
              {isExporting ? 'Export in progress...' : 'Export video'}
            </Button>
          </PanelCard>
        </div>

        {isExporting && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/48 px-4 backdrop-blur-sm">
            <PanelCard className="w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-slate-900">Exporting your video</h2>
              <p className="mt-1 text-sm text-slate-600">
                {progress.message}
              </p>
              <ProgressBar
                progress={progress.percent}
                label="Progress"
                details={`Stage: ${progress.stage.replace('-', ' ')}`}
                className="mt-4"
              />
            </PanelCard>
          </div>
        )}
      </div>
    </div>
  );
}
