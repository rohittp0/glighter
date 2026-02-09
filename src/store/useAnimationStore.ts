import { create } from 'zustand';
import type { AnimationConfig } from '../types/animation.types';

interface AnimationState {
  isPlaying: boolean;
  currentWaypointIndex: number;
  currentCountryCode: string | null;
  config: AnimationConfig | null;
  setPlaying: (playing: boolean) => void;
  setCurrentWaypoint: (index: number) => void;
  setCurrentCountry: (code: string | null) => void;
  setConfig: (config: AnimationConfig) => void;
  reset: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isPlaying: false,
  currentWaypointIndex: 0,
  currentCountryCode: null,
  config: null,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentWaypoint: (index) => set({ currentWaypointIndex: index }),
  setCurrentCountry: (code) => set({ currentCountryCode: code }),
  setConfig: (config) => set({ config }),
  reset: () => set({ isPlaying: false, currentWaypointIndex: 0, currentCountryCode: null }),
}));
