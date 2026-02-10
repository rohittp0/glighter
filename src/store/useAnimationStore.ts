import { create } from 'zustand';
import type { AnimationConfig } from '../types/animation.types';
import { DEFAULT_TEMPLATE_ID } from '../constants/templates';

interface AnimationState {
  isPlaying: boolean;
  currentWaypointIndex: number;
  currentCountryCode: string | null;
  config: AnimationConfig | null;
  selectedTemplateId: string;
  setPlaying: (playing: boolean) => void;
  setCurrentWaypoint: (index: number) => void;
  setCurrentCountry: (code: string | null) => void;
  setConfig: (config: AnimationConfig) => void;
  setSelectedTemplate: (templateId: string) => void;
  reset: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isPlaying: false,
  currentWaypointIndex: 0,
  currentCountryCode: null,
  config: null,
  selectedTemplateId: DEFAULT_TEMPLATE_ID,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentWaypoint: (index) => set({ currentWaypointIndex: index }),
  setCurrentCountry: (code) => set({ currentCountryCode: code }),
  setConfig: (config) => set({ config }),
  setSelectedTemplate: (templateId) => set({ selectedTemplateId: templateId }),
  reset: () => set({ isPlaying: false, currentWaypointIndex: 0, currentCountryCode: null }),
}));
