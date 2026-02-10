import { useEffect, useMemo, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapContainer } from '../components/map/MapContainer';
import { MarkerManager } from '../components/map/MarkerManager';
import { CountryLayer } from '../components/map/CountryLayer';
import { AnimationController } from '../components/map/AnimationController';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/ui/StepIndicator';
import { PanelCard } from '../components/ui/PanelCard';
import { useMarkerStore } from '../store/useMarkerStore';
import { useAnimationStore } from '../store/useAnimationStore';
import { ANIMATION_TEMPLATES, getTemplateById } from '../constants/templates';
import { generateAnimationConfig } from '../utils/animationHelpers';
import { cn } from '../lib/utils';

interface TemplateSelectionScreenProps {
  onBack: () => void;
  onNext: () => void;
}

const FLOW_STEPS = ['Locations', 'Templates', 'Preview', 'Result'];

export function TemplateSelectionScreen({ onBack, onNext }: TemplateSelectionScreenProps) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const markers = useMarkerStore((state) => state.markers);
  const {
    isPlaying,
    setPlaying,
    reset,
    setConfig,
    selectedTemplateId,
    setSelectedTemplate,
  } = useAnimationStore();

  const selectedTemplate = useMemo(
    () => getTemplateById(selectedTemplateId),
    [selectedTemplateId]
  );

  useEffect(() => {
    const config = generateAnimationConfig(markers, selectedTemplateId);
    setConfig(config);
  }, [markers, selectedTemplateId, setConfig]);

  const handlePreviewMotion = () => {
    reset();
    setPlaying(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#dbeeff_0%,#edf6ff_38%,#f6faff_100%)]">
      <div className="h-full md:grid md:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative h-full overflow-hidden md:min-h-0">
          <MapContainer onMapLoad={setMap} />
          <MarkerManager map={map} />
          <CountryLayer map={map} />
          <AnimationController map={map} />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,22,56,0.56)_0%,rgba(4,22,56,0.10)_32%,rgba(4,22,56,0.10)_68%,rgba(4,22,56,0.56)_100%)]" />

          <div className="absolute left-0 right-0 top-0 z-20 hidden p-4 sm:p-5 md:block">
            <div className="rounded-2xl border border-white/35 bg-white/15 p-3 text-white shadow-[0_14px_35px_rgba(5,26,60,0.35)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Step 2</p>
              <h1 className="text-2xl font-bold tracking-tight">Choose a template</h1>
              <p className="text-xs text-blue-100 sm:text-sm">Pick how the camera moves and how destinations are highlighted.</p>
              <StepIndicator currentStep={2} labels={FLOW_STEPS} className="mt-3" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/50 bg-white/88 p-3 text-sm shadow-lg shadow-blue-900/15">
              <span className="rounded-full bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">
                {selectedTemplate.subtitle}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {selectedTemplate.name}
              </span>
              <span className="ml-auto text-xs text-slate-600">
                {markers.length} stop{markers.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="absolute left-3 top-3 z-20 flex items-center gap-2 md:hidden">
            <Button onClick={onBack} variant="secondary" size="sm">
              ← Back
            </Button>
            <Button
              onClick={handlePreviewMotion}
              variant="secondary"
              size="sm"
              disabled={isPlaying || markers.length < 2}
            >
              {isPlaying ? 'Previewing...' : 'Preview'}
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-30 flex h-[52vh] flex-col rounded-t-3xl border border-white/65 bg-white/92 shadow-[0_-16px_40px_rgba(9,36,77,0.2)] backdrop-blur-xl md:hidden">
            <div className="border-b border-blue-100/85 px-4 py-3">
              <h2 className="text-base font-semibold text-slate-900">Template carousel</h2>
              <p className="text-xs text-slate-600">Swipe horizontally to choose a template.</p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-4 py-3">
              <div className="-mx-4 h-full overflow-x-auto px-4">
                <div className="flex h-full min-w-max items-stretch gap-3 pb-2">
                  {ANIMATION_TEMPLATES.map((template) => {
                    const isSelected = template.id === selectedTemplateId;
                    return (
                      <button
                        type="button"
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className="h-full w-[272px] shrink-0 text-left"
                      >
                        <PanelCard
                          className={cn(
                            'flex h-full flex-col p-4',
                            isSelected
                              ? 'border-cyan-300 ring-2 ring-cyan-300/65'
                              : 'border-transparent hover:border-blue-100'
                          )}
                        >
                          <div
                            className="mb-3 h-20 rounded-xl"
                            style={{ background: template.cardGradient }}
                          />
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              {template.durationLabel}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{template.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                            <span className="rounded-md bg-slate-100 px-2 py-1">{template.viewpointLabel}</span>
                            <span className="rounded-md bg-slate-100 px-2 py-1">{template.waypointDuration}ms transitions</span>
                          </div>
                        </PanelCard>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-blue-100/85 bg-white/96 p-4">
              <Button onClick={onNext} size="lg" className="w-full" disabled={markers.length < 2}>
                Continue to Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="z-30 hidden min-h-0 flex-col rounded-t-3xl border border-white/65 bg-white/86 shadow-[0_-16px_40px_rgba(9,36,77,0.2)] backdrop-blur-xl md:flex md:rounded-none md:border-l md:border-white/50 md:bg-white/80">
          <div className="flex items-center justify-between border-b border-blue-100/85 px-4 py-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              ← Back
            </Button>
            <Button onClick={handlePreviewMotion} variant="secondary" size="sm" disabled={isPlaying || markers.length < 2}>
              {isPlaying ? 'Previewing...' : 'Preview motion'}
            </Button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {ANIMATION_TEMPLATES.map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <button
                  type="button"
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    'w-full text-left transition-transform duration-200',
                    isSelected && 'scale-[1.01]'
                  )}
                >
                  <PanelCard
                    className={cn(
                      'p-4',
                      isSelected
                        ? 'border-cyan-300 ring-2 ring-cyan-300/65'
                        : 'border-transparent hover:border-blue-100'
                    )}
                  >
                    <div
                      className="mb-3 h-20 rounded-xl"
                      style={{ background: template.cardGradient }}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{template.name}</h3>
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                        {template.durationLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{template.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="rounded-md bg-slate-100 px-2 py-1">{template.viewpointLabel}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1">{template.waypointDuration}ms transitions</span>
                    </div>
                  </PanelCard>
                </button>
              );
            })}
          </div>

          <div className="border-t border-blue-100/85 bg-white/92 p-4">
            <Button onClick={onNext} size="lg" className="w-full" disabled={markers.length < 2}>
              Continue to Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
