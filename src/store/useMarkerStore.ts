import { create } from 'zustand';
import type { Marker } from '../types/marker.types';

interface MarkerState {
  markers: Marker[];
  addMarker: (position: [number, number]) => void;
  removeMarker: (id: string) => void;
  updateMarkerPosition: (id: string, position: [number, number]) => void;
  updateMarkerCountry: (id: string, countryCode: string, countryName: string) => void;
  reorderMarkers: (fromIndex: number, toIndex: number) => void;
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
  reorderMarkers: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex < 0
        || toIndex < 0
        || fromIndex >= state.markers.length
        || toIndex >= state.markers.length
        || fromIndex === toIndex
      ) {
        return state;
      }

      const reordered = [...state.markers];
      const [movedMarker] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedMarker);

      return {
        markers: reordered.map((marker, index) => ({
          ...marker,
          order: index + 1,
        })),
      };
    }),
  clearMarkers: () => set({ markers: [] }),
}));
