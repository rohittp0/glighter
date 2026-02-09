import { create } from 'zustand';
import type { Marker } from '../types/marker.types';

interface MarkerState {
  markers: Marker[];
  addMarker: (position: [number, number]) => void;
  removeMarker: (id: string) => void;
  updateMarkerPosition: (id: string, position: [number, number]) => void;
  updateMarkerCountry: (id: string, countryCode: string, countryName: string) => void;
  clearMarkers: () => void;
}

export const useMarkerStore = create<MarkerState>((set) => ({
  markers: [],
  addMarker: (position) => set((state) => ({
    markers: [...state.markers, {
      id: crypto.randomUUID(),
      position,
      order: state.markers.length + 1,
    }],
  })),
  removeMarker: (id) => set((state) => ({
    markers: state.markers.filter(m => m.id !== id).map((m, i) => ({ ...m, order: i + 1 })),
  })),
  updateMarkerPosition: (id, position) => set((state) => ({
    markers: state.markers.map(m => m.id === id ? { ...m, position } : m),
  })),
  updateMarkerCountry: (id, countryCode, countryName) => set((state) => ({
    markers: state.markers.map(m => m.id === id ? { ...m, countryCode, countryName } : m),
  })),
  clearMarkers: () => set({ markers: [] }),
}));
